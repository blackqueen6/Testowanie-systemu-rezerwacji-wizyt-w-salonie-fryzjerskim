# Testy manualne (TestCase)

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
