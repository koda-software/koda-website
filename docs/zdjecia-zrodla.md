# Zdjęcia na stronie - źródła i licencja

Zdjęcia w banerach pochodzą z Unsplash. Licencja Unsplash pozwala na użycie
komercyjne bez opłat i bez obowiązku podania autora; autorzy są tu odnotowani,
bo to dobra praktyka i ułatwia późniejszą weryfikację.

Pliki płatne (Unsplash+) zostały świadomie pominięte przy doborze.

| Plik w `public/photos/` | Gdzie użyte | Autor | Adres |
|---|---|---|---|
| `zespol-przy-monitorach-*` | baner strony głównej | Sigmund (@sigmund) | unsplash.com/photos/Fa9b57hffnM |
| `stanowisko-w-magazynie-*` | baner Opero i stron funkcji | Equal Stock (@equalstock) | unsplash.com/photos/Ggjba7uZC-I |
| `przeglad-dokumentow-*` | baner Rozwiązań | Minakko (@minakko) | unsplash.com/photos/wR56AUlEsE4 |
| `biuro-otwarta-przestrzen-*` | baner O nas i nagłówki bloga | Yolk Coworking Kraków (@yolk_coworking_krakow) | unsplash.com/photos/AQdyCfXWxB4 |
| `sala-spotkan-*` | baner Kontaktu | Rodeo Project Management (@getrodeo) | unsplash.com/photos/ONe-snuCaqQ |

## Jak są przygotowane

Każde zdjęcie ma sześć plików: AVIF i WebP w szerokościach 1024, 1600 i 2200 px.
Przeglądarka wybiera najlżejszy wariant, który obsługuje, w rozmiarze
odpowiednim do ekranu - na typowym monitorze jest to 22-60 KB.

Odbarwienie i lekkie przyciemnienie są **wpalone w pliki**, nie nakładane
filtrem CSS. Filtr na zdjęciu rozciągniętym na całą szerokość jest przemalowywany
przez kompozytor przy każdej klatce, a odbarwiony obraz dodatkowo kompresuje się
mniejszy - więc to oszczędność podwójna.

`next.config.ts` ma `images.unoptimized: true`, więc `next/image` nie
przeskalowałby tych plików samodzielnie. Warianty muszą powstawać poza aplikacją.
Skrypt, którym zostały wygenerowane, jest opisany na dole tego pliku.

## ⚠ Do decyzji

1. **Zweryfikować licencję** bezpośrednio na Unsplash przed publikacją - warunki
   mogą się zmienić.
2. **Wizerunek osób.** Na zdjęciach widać rozpoznawalne twarze. Przy użyciu
   ilustracyjnym, w mocno przyciemnionym tle, licencja Unsplash to pokrywa,
   ale warto mieć świadomość, że są to obce osoby, a nie zespół KodaSoft.
3. **Docelowo: własna sesja.** Pół dnia zdjęciowego w biurze daje materiał,
   którego nie ma konkurencja, i usuwa oba powyższe zastrzeżenia. Zdjęcia
   stockowe traktujemy jako etap przejściowy.

## Generowanie wariantów

```python
from PIL import Image, ImageEnhance

im = Image.open(source).convert("RGB")
im = ImageEnhance.Color(im).enhance(0.35)       # prawie odbarwione, ślad koloru zostaje
im = ImageEnhance.Brightness(im).enhance(0.92)  # i tak leży pod ciemnym gradientem

for w in (1024, 1600, 2200):
    r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    r.save(f"{name}-{w}.avif", quality=44)
    r.save(f"{name}-{w}.webp", quality=62, method=6)
```
