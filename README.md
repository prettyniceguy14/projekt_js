# Projekt zaliczeniowy JS

Projekt na zaliczenie części **JS** z laboratorium **Technologie Internetowe**.

Uniwersytet Rzeszowski, Informatyka I st. II rok sem. zimowy

Wykonał: **Karol Bobowski**

**Link do działającej wersji strony: https://prettyniceguy14.github.io/projekt_js/**

---

## Opis projektu

Projekt przedstawia przykładową implementacje struktury opartej o blockchain. Aplikacja pozwala na tworzenie i "wydobywanie" bloków zawierających dane. Pozwala również na zmiany w "wydobytych" wcześniej blokach i wizualizację konsekwencji, jakie niosą ze sobą owe zmiany tj. zmiana hash'u aktualnego i każdego następnego bloku, "zepsucie" samej struktury - (uznanie blockchain'u jako invalid) i konieczność ponownego "wydobycia" wszystkich invalid bloków.

Projekt opiera się o model **proof of work** gdzie blok uznawany jest jako **valid** w przypadku gdy jego hash rozpoczyna się od danej ilości zer równej trudności sieci w czasie wydobycia samego bloku. W tym przypadku aplikacja korzysta z algorytmu **SHA-1** do wyliczenia hash'u danego bloku w którego skład wchodzą:

    - ID bloku
    - Poprzedni hash bloku
    - Data utworzenia bloku
    - Dane bloku
    - Trudność wydobycia
    - NONCE

Wydobycie bloku polega na zwiększaniu wartości **NONCE**, kalkulacji hash'u i każdorazowym sprawdzeniu, czy owy zaczyna się od danej ilości zer ustalonej na podstawie trudności sieci w danej chwili. Należy pamiętać, że im większa trudność sieci, tym dłużej zajmie "wydobycie" danego bloku tj. znalezienie hash'u spełniającego warunek. Na czas "wydobycia" danego bloku ma również wpływ specyfikacja sprzętu, który dokonuje obliczeń.

Aplikacja pozwala na ręczną inkrementacje i dekrementacje trudności sieci która defaultowo ustawiona jest na **2**. (To znaczy: hash każdego **valid** bloku <u>musi</u> zaczynać się od dwóch zer). 

Znalezienie odpowiedniego **nonce** bloku (tj. jego wydobycie) przy trudności sieci równej **2** jest stosunkowo szybkie (mniej niż sekunda) na PC jak i na telefonie, zwiększenie trudności do **5** <u>drastycznie</u> zwiększa czas wydobycia do kilkudziesięciu sekund, natomiast przy wartości **6** wydobycie trwa nawet kilka minut (testowane na i9-9900k).


`Każda kolejna inkrementacja trudności sieci ma gargantuiczny wpływ na czas wydobycia bloku. W przypadku modyfikacji któregoś z już wydobytych bloków, każdy następny blok musi zostać ponownie 'wydobyty' co niesie za sobą ogromny koszt czasowy.`



## Struktura projektu

Strona składa się z czystego HTML, CSS i JS bez użycia jakichkolwiek bibliotek czy też gotowych komponentów.

Zawartość plików i katalogów:

> `index.html` - aplikacja.

> `blockchain.js` - plik zawierający klasę bloku, klasę blockchain'a oraz asynchroniczną funkcję liczącą SHA-1 i funkcję do generowania aktualnej daty w przystępnym formacie.

> `script.js` - plik zawierający instancję klasy blockchain (`boboChain`), wszystkie eventListenery w aplikacji oraz funkcję która renderuje bloki na stronie (`function render(...){...}`).

> `style.css` - plik zawierający wszystkie css'y na stronie.

> `../js/` - katalog zawierający skrypty.

> `../img/` - katalog zawierający wszystkie grafiki umieszczone na stronie.


## Kawałki kodu

Funkcja licząca SHA-1 (`crypto.*` jest wbudowane w przeglądarke): 
```js
async function sha1(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));              
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
```

Klasa bloku oraz metody do kalkulacji aktualnego hash'u i wydobycia bloku:

```js
class Block{
    constructor(index, time, data, diff, previousHash = ''){
        this.index = index;
        this.time = time;
        this.data = data;
        this.block_difficulty = diff;
        this.previousHash = previousHash;
        this.hash = "";
        this.nonce = 0;
    }

    async calculateHash(){
        var result =  await sha1(this.index + this.previousHash + this.time + this.data + this.diff + this.nonce);
        return result;
    }

    async mineBlock(diff){
        this.nonce = 0;
        this.hash = await this.calculateHash();
        while(this.hash.substring(0, diff) !== Array(diff + 1).join("0")){
            this.nonce++;
            this.hash = await this.calculateHash();
        }
    }
}
```

Event listener zapięty na pole zawierające dane bloku:

```js
newDiv.children[4].children[1].addEventListener("blur", function(r) {
            const newValue = r.target.value;
            const blockID = r.target.parentElement.parentElement.children[0].children[1].value;
            chain.chain[blockID].data = newValue;
            chain.chain[blockID].calculateHash().then(newHash => {
                chain.chain[blockID].hash = newHash;
                render(chain);
            });
        });
```


### Strona jest w pełni zgodna ze standardami W3C:

> https://validator.w3.org/nu/?doc=https%3A%2F%2Fprettyniceguy14.github.io%2Fprojekt_js%2Findex.html


## UI / Wygląd Desktop

![Screen Shot 2022-01-25 at 16 56 16-fullpage](https://user-images.githubusercontent.com/84191672/151011739-aee45185-6a21-4579-b934-b98a155fbc64.png)

![Screen Shot 2022-01-25 at 16 57 24-fullpage](https://user-images.githubusercontent.com/84191672/151011981-44894875-5fef-45b4-9764-29205352a046.png)

![Screen Shot 2022-01-25 at 16 59 05-fullpage](https://user-images.githubusercontent.com/84191672/151012236-7267f1c0-9885-468d-8500-8b60ecaa6674.png)

![Screen Shot 2022-01-25 at 17 00 09-fullpage](https://user-images.githubusercontent.com/84191672/151012428-ca2cb668-a1e4-4923-870a-0e4be70d88b6.png)

![Screen Shot 2022-01-25 at 17 00 50-fullpage](https://user-images.githubusercontent.com/84191672/151012564-9aaf29e6-215a-4d67-a065-b75ca737e864.png)

![Screen Shot 2022-01-25 at 17 01 46-fullpage](https://user-images.githubusercontent.com/84191672/151012743-8b91146e-1bb0-4598-b57f-3625a597e8cd.png)



## UI / Wygląd Mobile

![Screen Shot 2022-01-25 at 17 04 38-fullpage](https://user-images.githubusercontent.com/84191672/151013313-40202cb4-194b-437e-ae13-922ad29cee17.png)

![Screen Shot 2022-01-25 at 17 05 35-fullpage](https://user-images.githubusercontent.com/84191672/151013494-b8e8d3e4-4b19-4dc0-ab26-f50ad1cd5a3d.png)

![Screen Shot 2022-01-25 at 17 06 04](https://user-images.githubusercontent.com/84191672/151013596-8e063ff3-60fe-4122-83db-fa1dcfac4ee3.png)
