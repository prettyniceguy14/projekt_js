# Projekt zaliczeniowy JS

Projekt na zaliczenie części **JS** z laboratorium **Technologie Internetowe**.

Uniwersytet Rzeszowski, Informatyka I st. II rok sem. zimowy

Wykonał: **Karol Bobowski**

**Link do działającej wersji strony: https://prettyniceguy14.github.io/projekt_js/**

---

## Opis projektu

Projekt przedstawia przykładową implementacje struktury opartej o blockchain. Aplikacja pozwala na tworzenie i "wydobywanie" bloków zawierających dane. Pozwala również na zmiany w "wydobytych" wcześniej blokach i wizualizację konsekwencji jakie niosą ze sobą owe zmiany tj. zmiana hash'u aktualnego i każdego następnego bloku, "zepsucie" samej struktury - (uznanie blockchain'u jako invalid) i konieczność ponownego "wydobycia" wszystkich invalid bloków.

Projekt opiera się o model **proof of work** gdzie blok uznawany jest jako **valid** w przypadku gdy jego hash rozpoczyna się od danej ilości zer równej trudności sieci w czasie wydobycia samego bloku. W tym przypadku aplikacja korzysta z algorytmu **SHA-1** do wyliczenia hash'u danego bloku w którego skład wchodzą:

    - ID bloku
    - Poprzedni hash bloku
    - Data utworzenia bloku
    - Dane bloku
    - NONCE

Wydobycie bloku polega na zwiększaniu wartości **NONCE**, kalkulacji hash'u i każdorazowym sprawdzeniu czy owy zaczyna się od danej ilości zer ustalonej na podstawie trudności sieci w danej chwili. Należy pamiętać że im większa trudność sieci tym dłużej zajmie "wydobycie" danego bloku tj. znalezienie hash'u spełniającego warunek. Na czas "wydobycia" danego bloku ma również wpływ specyfikacja sprzętu który dokonuje obliczeń.

Aplikacja pozwala na ręczną inkrementacje i dekrementacje trudności sieci która defaultowo ustawiona jest na **2**. (To znaczy: hash każdego **valid** bloku <u>musi</u> zaczynać się od dwóch zer). 

Znalezienie odpowiedniego **nonce** bloku (tj. jego wydobycie) przy trudności sieci równej **2** jest stosunkowo szybkie (mniej niż sekunda) na PC jak i na telefonie, zwiększenie trudności do **5** <u>drastycznie</u> zwiększa czas wydobycia do kilkudziesięciu sekund, natomiast przy wartości **6** wydobycie trwa nawet kilka minut (testowane na i9-9900k).


`Każda kolejna inkrementacja trudności sieci ma gargantuiczny wpływ na czas wydobycia bloku. W przypadku modyfikacji któregoś z już wydobytych bloków, każdy następny blok musi zostać ponownie 'wydobyty' co niesie za sobą ogromny koszt czasowy.`



## Struktura projektu

Strona składa się z czystego HTML i CSS bez użycia jakichkolwiek bibliotek czy też gotowych komponentów.

Zawartość plików i katalogów:

> `index.html` - aplikacja.

> `blockchain.js` - plik zawierający klasę bloku, klasę blockchain'a oraz asynchroniczną funkcję liczącą SHA-1 i funkcję do generowania aktualnej daty w przystępnym formacie.

> `script.js` - plik zawierający instancję klasy blockchain (`boboChain`), wszystkie eventListenery w aplikacji oraz funkcję która renderuje bloki na stronie (`function render(...){...}`).

> `style.css` - plik zawierający wszystkie css'y na stronie.

> `../js/` - katalog zawierający skrypty.

> `../img/` - katalog zawierający wszystkie grafiki umieszczone na stronie.


## Kawałki kodu

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




## UI / Wygląd Mobile

