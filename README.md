# Testowanie i Jakość Oprogramowania
## Autor : Klaudia Foszcz

## Temat projektu : Testowanie systemu rezerwacji wizyt w salonie fryzjerskim.

## Opis projektu
Projekt stanowi fragment pracy inżynierskiej pt. **„Projekt i implementacja aplikacji webowej do zarządzania rezerwacjami wizyt w salonie fryzjerskim”**.  
Celem tego fragmentu jest przetestowanie funkcjonalności systemu rezerwacji wizyt w salonie fryzjerskim. Aplikacja została zaprojektowana jako kompleksowe rozwiązanie umożliwiające klientom wygodne zarządzanie rezerwacjami online, a fryzjerom efektywne organizowanie swojej pracy.Projekt został zaprojektowany jako aplikacja webowa z podziałem na frontend i backend. Część backendowa zarządza bazą danych, autoryzacją użytkowników i logiką biznesową, podczas gdy frontend obsługuje interfejs użytkownika.

### System obejmuje następujące kluczowe funkcjonalności:
- **Logowanie i rejestracja użytkowników** – każdy klient ma możliwość stworzenia konta w systemie i logowania się w celu korzystania z pełnej funkcjonalności aplikacji.
- **Rezerwowanie wizyt** – użytkownik może wybrać datę, godzinę, fryzjera oraz interesującą go usługę i dokonać rezerwacji.
- **Edycja rezerwacji przez fryzjera** – fryzjerzy mają możliwość wprowadzania zmian w istniejących rezerwacjach, aby lepiej zarządzać swoim harmonogramem.
- **Odwoływanie wizyt** – klienci mogą z łatwością odwołać wcześniej zaplanowaną wizytę, a system automatycznie zwalnia zarezerwowany termin.
- **Usuwanie konta** – użytkownicy mogą trwale usunąć swoje konto.
- **Wysyłanie potwierdzenia rezerwacji** - po dokonaniu rezerwacji przychodzi na e-mail użytkownika potwierdzenie rezerwacji wizyty.
- **Wysyłanie przypomnienia o rezerwacji** - dzień przed planowaną wizytą klient otrzymuje wiadomość przypominającą. Jeśli rezerwacja została dokonana tego samego dnia, przypomnienie nie jest wysyłane.

## Uruchomienie projektu : W terminalu wpisujemy komendę (npm run start).

## Testy
Testy jednostkowe i integracyjne można je uruchomić za pomocą komend: npm test -- --testPathPattern=hairdresserController.test.mjs, npm test -- --testPathPattern=reservationController.test.mjs, npm test -- --testPathPattern=authController.test.js, npm test -- --testPathPattern=reservationController.test.js

### Opis testów jednostkowych:
#### Hairdresser Controller

1. **`deleteHairdresser`**
   - **Powinien usunąć fryzjera**: Test sprawdza, czy funkcja `deleteHairdresser` poprawnie usuwa fryzjera z bazy danych i zwraca odpowiedź z kodem 200 oraz komunikatem sukcesu.
   - **Powinien zwrócić błąd, jeśli usunięcie fryzjera się nie powiodło**: Test sprawdza, czy funkcja zwraca odpowiedni kod błędu (500) i komunikat w przypadku, gdy usunięcie fryzjera nie powiodło się z powodu błędu serwera.

2. **`getHairdresserTimeSlots`**
   - **Powinien zwrócić harmonogram fryzjera**: Test weryfikuje, czy funkcja `getHairdresserTimeSlots` zwraca poprawne dane dotyczące dostępnych godzin pracy fryzjera.

3. **`getHairdresserAppointments`**
   - **Powinien zwrócić wizyty fryzjera**: Test sprawdza, czy funkcja poprawnie zwraca listę wizyt fryzjera w postaci tablicy zawierającej daty wizyt.
   - **Powinien zwrócić błąd, jeśli ID fryzjera jest nieprawidłowe**: Test weryfikuje, czy funkcja zwraca kod błędu 400 oraz komunikat, gdy przekazano nieprawidłowe ID fryzjera.

#### Reservation Controller

1. **`createReservation`**
   - **Powinien utworzyć nową rezerwację**: Test sprawdza, czy funkcja poprawnie tworzy nową rezerwację w bazie danych i zwraca kod 201 wraz z informacjami o nowo utworzonej rezerwacji.
   - **Nie powinien utworzyć rezerwacji, jeśli klient ma już rezerwację w tym terminie**: Test sprawdza, czy funkcja uniemożliwia utworzenie nowej rezerwacji, jeśli klient ma już zajęty termin, i zwraca odpowiedni kod błędu (400).
   - **Nie powinien utworzyć rezerwacji, jeśli fryzjer jest już zajęty w tym terminie**: Test weryfikuje, czy funkcja blokuje rezerwację terminu, jeśli fryzjer jest już zajęty, i zwraca komunikat błędu.
   - **Nie powinien utworzyć rezerwacji, jeśli fryzjer jest na urlopie**: Test sprawdza, czy funkcja zwraca odpowiedni komunikat i kod błędu (400), gdy fryzjer jest niedostępny z powodu urlopu.
   - **Nie powinien utworzyć rezerwacji, jeśli usługi są wymagane**: Test weryfikuje, czy funkcja blokuje możliwość utworzenia rezerwacji bez określenia usług i zwraca stosowny komunikat błędu.

2. **`getMyAppointments`**
   - **Powinien zwrócić umówione wizyty użytkownika**: Test sprawdza, czy funkcja poprawnie zwraca listę umówionych wizyt dla zalogowanego użytkownika, wraz z odpowiednimi danymi, takimi jak data i godzina wizyty.

### Lokalizacja testów jednostkowych
- [backend/tests/hairdresserController.test.mjs](backend/tests/hairdresserController.test.mjs)
- [backend/tests/reservationController.test.mjs](backend/tests/reservationController.test.mjs)

### Opis testów integracyjnych:
#### Auth Controller

1. **Rejestracja nowego użytkownika**  
   - **Powinien zarejestrować nowego użytkownika**  
     Test sprawdza, czy użytkownik może poprawnie zarejestrować konto, zwracając kod 201 oraz komunikat `Użytkownik został zarejestrowany`.

2. **Logowanie użytkownika**  
   - **Powinien zalogować użytkownika**  
     Test weryfikuje, czy istniejący użytkownik może się zalogować, a serwer zwraca kod 200 oraz token uwierzytelniający.

3. **Resetowanie hasła**  
   - **Powinien wysłać kod do zresetowania hasła**  
     Test sprawdza, czy serwer wysyła kod resetowania na podany adres e-mail użytkownika, zwracając kod 200 oraz komunikat `Kod weryfikacyjny został wysłany na email`.  
   - **Powinien zweryfikować kod resetowania**  
     Test sprawdza, czy kod resetowania jest poprawnie weryfikowany, zwracając kod 200 oraz komunikat `Kod weryfikacyjny został zweryfikowany`.  
   - **Powinien zaktualizować hasło**  
     Test weryfikuje, czy użytkownik może poprawnie zaktualizować swoje hasło przy użyciu kodu resetowania, zwracając kod 200 oraz komunikat `Hasło zostało zmienione`.

#### Reservation Controller

1. **Tworzenie rezerwacji**  
   - **Powinien utworzyć nową rezerwację**  
     Test sprawdza, czy użytkownik może poprawnie utworzyć nową rezerwację, zwracając kod 201 oraz dane dotyczące utworzonej rezerwacji.  
   - **Nie powinien utworzyć rezerwacji bez godziny**  
     Test sprawdza, czy serwer blokuje rezerwację, gdy nie podano godziny, zwracając kod 400 oraz komunikat `Godzina jest wymagana`.  
   - **Nie powinien utworzyć rezerwacji, jeśli klient ma już rezerwację w tym terminie**  
     Test weryfikuje, czy serwer uniemożliwia rezerwację, jeśli klient ma już zajęty termin, zwracając kod 400 oraz komunikat `Klient ma już rezerwację w tym terminie`.

2. **Aktualizacja rezerwacji**  
   - **Powinien zaktualizować rezerwację przez fryzjera**  
     Test sprawdza, czy fryzjer może zmienić datę lub godzinę wizyty, a serwer zwraca kod 200 oraz dane zaktualizowanej rezerwacji.

3. **Usuwanie rezerwacji**  
   - **Powinien usunąć rezerwację**  
     Test sprawdza, czy użytkownik może poprawnie usunąć rezerwację, zwracając kod 200 oraz komunikat `Usunięto pomyślnie`.  
     Dodatkowo test weryfikuje, czy rezerwacja została faktycznie usunięta z bazy danych.
     
### Lokalizacja testów integracyjnych
- [backend/tests/authController.test.js](backend/tests/authController.test.js)
- [backend/tests/reservationController.test.js](backend/tests/reservationController.test.js)
  
## Dokumentacja API
Dokumentacja API znajduje się pod adresem: [http://localhost:5000/api-docs/](http://localhost:5000/api-docs/) po uruchomieniu aplikacji. Wykorzystano Swaggera do jej stworzenia. 

## Testy manualne (TestCase)

| **ID**              | **TC001**                                  |
|----------------------|--------------------------------------------|
| **Tytuł**           | Przycisk „Umów” dla użytkownika niezalogowanego |
| **Warunki początkowe** | Użytkownik nie jest zalogowany, aplikacja **Salon fryzjerski** jest otwarta. |
| **Kroki testowe**    | 1. Rozwiń dowolną kategorię usług, klikając w nią na stronie **Rezerwacja**.  <br> 2. Kliknij przycisk **Umów** przy jednej z usług. |
| **Oczekiwany rezultat** | Użytkownik zostaje przekierowany na stronę **/login**, żeby się zalogował. |

| **ID**              | **TC002**                                  |
|----------------------|--------------------------------------------|
| **Tytuł**           | Przycisk „Umów” dla zalogowanego użytkownika |
| **Warunki początkowe** | Użytkownik jest zalogowany (klient), aplikacja **Salon fryzjerski** jest otwarta. |
| **Kroki testowe**    | 1. Rozwiń dowolną kategorię usług, klikając w nią na stronie **Rezerwacja**.  <br> 2. Kliknij przycisk **Umów** przy jednej z usług. |
| **Oczekiwany rezultat** | Użytkownik zostaje przekierowany na stronę **/calendar**, gdzie jest rezerwacja wizyty online. |

| **ID**               | **TC003**                                      |
|-----------------------|-----------------------------------------------|
| **Tytuł**            | Tworzenie rezerwacji z poprawnymi danymi       |
| **Warunki początkowe**| Aplikacja **Salon fryzjerski** jest uruchomiona, użytkownik jest zalogowany (klient) i jest na stronie **/calendar**. |
| **Kroki testowe**     | 1. Kliknij pole, pod napisem **Wybierz datę**, żeby rozwinąć kalendarz. <br> 2. Wybierz datę wizyty **2024-12-23**. <br> 3. Wybierz fryzjera **Anna Kowalska** z listy. <br> 4. Wybierz jedną lub więcej usług, rozwijając listę usług i klikając na przycisk **Dodaj**. <br> 5. Wybierz godzinę wizyty **13:00**. <br> 6. Kliknij przycisk **Potwierdź rezerwację**. |
| **Oczekiwany rezultat**| Rezerwacja zostaje utworzona, pojawia się komunikat **Zarezerwowano wizytę, dziękujemy!** i zostaje wysłana wiadomość z potwierdzeniem rezerwacji na e-mail użytkownika. |

| **ID**               | **TC004**                                      |
|-----------------------|-----------------------------------------------|
| **Tytuł**            | Tworzenie rezerwacji, gdy użytkownik ma już rezerwację w danym terminie |
| **Warunki początkowe**| Aplikacja **Salon fryzjerski** jest uruchomiona, użytkownik (klient) ma istniejącą rezerwację w terminie **2024-12-23 13:00** do fryzjera **Anna Kowalka**. |
| **Kroki testowe**     | 1. Kliknij w pole, pod napisem **Wybierz datę**, żeby rozwinąć kalendarz. <br> 2. Wybierz datę wizyty **2024-12-23**. <br> 3. Wybierz fryzjera **Ewa Nowak** z listy. <br> 4. Wybierz jedną lub więcej usług, rozwijając listę usług i klikając na przycisk **Dodaj**. <br> 5. Wybierz godzinę wizyty **13:00**. <br> 6. Kliknij przycisk **Potwierdź rezerwację**. |
| **Oczekiwany rezultat**| Pojawia się komunikat **Nie można zrobić rezerwacji, ponieważ już masz w tym terminie rezerwację u innego fryzjera. Wybierz inny termin.** |

| **ID**               | **TC005**                                      |
|-----------------------|-----------------------------------------------|
| **Tytuł**            | Sprawdzenie blokady dat z przeszłości          |
| **Warunki początkowe**| Aplikacja **Salon fryzjerski** jest uruchomiona, użytkownik jest zalogowany (klient) i jest na stronie **/calendar**. |
| **Kroki testowe**     | 1. Kliknij na pole wyboru daty. <br> 2. Próbuj wybrać datę z przeszłości. |
| **Oczekiwany rezultat**| Niemożliwe jest wybranie daty wcześniejszej niż dzisiejsza. |

| **ID**               | **TC006**                                      |
|-----------------------|-----------------------------------------------|
| **Tytuł**            | Sprawdzenie dostępnych godzin przy zarezerwowanych terminach |
| **Warunki początkowe**| Aplikacja **Salon fryzjerski** jest uruchomiona, użytkownik (klient) ma istniejącą rezerwację w terminie **2024-12-20 11:00** do fryzjera **Anna Kowalska**. |
| **Kroki testowe**     | 1. Kliknij w pole, pod napisem **Wybierz datę**, żeby rozwinąć kalendarz. <br> 2. Wybierz datę wizyty **2024-12-20**. <br> 3. Wybierz fryzjera **Anna Kowalska** z listy. <br> 4. Wybierz jedną lub więcej usług, rozwijając listę usług i klikając na przycisk **Dodaj**. <br> 5. Sprawdź dostępne godziny. |
| **Oczekiwany rezultat**| W liście godzin wyświetlane są wyłącznie dostępne terminy. Zarezerwowane godziny nie są widoczne dla użytkownika. |


| **ID**   | TC007                              |
|----------|------------------------------------|
| **Tytuł** | Odwołanie wizyty                  |
| **Warunki początkowe** | Aplikacja Salon Fryzjerski jest uruchomiona. Użytkownik (klient) jest zalogowany i posiada aktywną rezerwację, którą może odwołać. |
| **Kroki testowe** | 1. Kliknij ikonę awatara z inicjałami, w prawym górnym rogu. <br> 2. W sekcji *Moje Rezerwacje* znajdź rezerwację, która ma przycisk *Odwołaj wizytę*. <br> 3. Kliknij przycisk *Odwołaj wizytę*. <br> 4. Potwierdź operację, klikając przycisk *OK* w wyświetlonym komunikacie. |
| **Oczekiwany rezultat** | Rezerwacja wizyty zostaje pomyślnie usunięta, a strona automatycznie odświeża listę z pozostałymi, aktywnymi rezerwacjami. |

| ID       | TC008                              |
|----------|------------------------------------|
| **Tytuł** | Usunięcie usługi z listy           |
| **Warunki początkowe** | Aplikacja **Salon fryzjerski** jest uruchomiona, użytkownik (klient) jest zalogowany i jest na stronie `/calendar`. |
| **Kroki testowe** | 1. Rozwiń listę usług.  <br> 2. Kliknij przycisk **Dodaj** koło danej usługi, żeby ją dodać.  <br> 3. Kliknij przycisk **X** obok usługi w sekcji **Wybrane usługi**. |
| **Oczekiwany rezultat** | Dana usługa zostaje usunięta w sekcji **Wybrane usługi**. |

| **ID**   | TC009                              |
|----------|------------------------------------|
| **Tytuł** | Logowanie z poprawnymi danymi     |
| **Warunki początkowe** | Aplikacja Salon Fryzjerski jest otwarta. |
| **Kroki testowe** | 1. Kliknij przycisk *Zaloguj* w górnym prawym rogu. <br> 2. Wprowadź poprawny adres e-mail. <br> 3. Wprowadź poprawne hasło. <br> 4. Kliknij przycisk *Zaloguj się*. |
| **Oczekiwany rezultat** | Użytkownik zostaje zalogowany i przekierowany na stronę */reservation* (*Rezerwacja*). |

| **ID**   | TC010                              |
|----------|------------------------------------|
| **Tytuł** | Resetowanie hasła                 |
| **Warunki początkowe** | Aplikacja Salon Fryzjerski jest uruchomiona, użytkownik posiada istniejące konto. |
| **Kroki testowe** | 1. Kliknij przycisk *Zaloguj* w górnym prawym rogu. <br> 2. Kliknij opcję *Zapomniałeś hasła?* na stronie logowania. <br> 3. Wprowadź poprawny adres e-mail użytkownika. <br> 4. Kliknij przycisk *Wyślij kod weryfikacyjny*. <br> 5. Sprawdź skrzynkę e-mail i skopiuj kod weryfikacyjny. <br> 6. Wprowadź otrzymany kod w polu *Kod weryfikacyjny*. <br> 7. Kliknij przycisk *Zweryfikuj kod*. <br> 8. Wprowadź nowe hasło w polu *Nowe hasło*. <br> 9. Kliknij przycisk *Zmień hasło*. <br> 10. Przejdź do strony logowania i zaloguj się nowym hasłem. |
| **Oczekiwany rezultat** | 1. Kod weryfikacyjny zostaje wysłany na adres e-mail użytkownika. <br> 2. Kod jest poprawnie zweryfikowany. <br> 3. Nowe hasło zostaje ustawione. <br> 4. Użytkownik może zalogować się nowym hasłem. |

## Technologie użyte w projekcie
### Backend:
- Node.js
- Express.js
- MongoDB (z użyciem Mongoose)
- jsonwebtoken – do autoryzacji użytkowników.
- nodemailer – do wysyłania powiadomień e-mail.
### Frontend:
- React
- Vite
- React Router – do zarządzania trasami.
- React Toastify – do powiadomień użytkownika.
- Tailwind CSS – do szybkiego prototypowania stylów.
### Technologie użyte do testów:
- Jest – do testów jednostkowych.
- Supertest – do testów API.
