# Maanslogen – Domænemodel & Datadesign

Dette repository beskriver domænemodellen og datadesignet for **Maanslogen**, et system til anmeldelse af drikkevarer (fx øl, vin og spiritus).

Designet er lavet med fokus på:
- dynamiske attributter og spørgsmål
- kategorier og typer
- minimal behov for datamigrering
- mulighed for at starte småt og udvide senere

---

## Overordnet arkitektur

Systemet består af følgende hoveddele:

- Brugere og anmeldelser
- Drikkevarer opdelt i kategorier og typer
- Dynamiske attributter (fx alkohol %, farve)
- Dynamiske spørgsmål i anmeldelser
- Klar adskillelse mellem definition og værdi

---

## Centrale domæneklasser

### BeverageCategory

**Formål:**  
Overordnet kategori for drikkevarer (fx Øl, Vin, Spiritus).

**Felter:**
- `id` (PK)
- `name`
- `description`
- `icon`

**Relationer:**
- Har mange `BeverageType`
- Har mange `AttributeDefinition`
- Har mange `Question`

---

### BeverageType

**Formål:**  
En specifik type inden for en kategori (fx IPA under Øl).

**Felter:**
- `id` (PK)
- `categoryId` (FK → BeverageCategory.id)
- `name`
- `description`
- `active`
- `createdAt`

**Relationer:**
- Tilhører én `BeverageCategory`
- Har mange `Beverage`
- Har mange type-specifikke `AttributeDefinition`
- Har mange type-specifikke `Question`

---

### Beverage

**Formål:**  
En konkret drikkevare, som kan anmeldes.

**Felter:**
- `id` (PK)
- `typeId` (FK → BeverageType.id)
- `brand`
- `name`
- `country`
- `imageUrl`
- `createdAt`

**Relationer:**
- Tilhører én `BeverageType`
- Har mange `BeverageAttributeValue`
- Har mange `Review`

---

## Dynamiske attributter

### AttributeDefinition

**Formål:**  
Definerer hvilke attributter en drikkevare kan/må have.

Eksempler:
- Alkohol %
- Farve
- Bitterhed (IBU)

**Felter:**
- `id` (PK)
- `categoryId` (FK → BeverageCategory.id)
- `typeId` (FK → BeverageType.id, nullable)
- `key` (fx `alcohol_percent`)
- `displayName`
- `dataType` (`STRING | NUMBER | BOOLEAN | ENUM`)
- `required`
- `filterable`
- `validationRules` (JSON)
- `options` (JSON)
- `sortOrder`

**Vigtig regel:**
- `categoryId` er altid sat
- `typeId`:
  - `NULL` → gælder for hele kategorien
  - sat → gælder kun for den specifikke type

Dette gør det muligt at tilføje nye attributter uden at ændre eksisterende data.

---

### BeverageAttributeValue

**Formål:**  
Gemmer værdien af en attribut for en konkret drikkevare.

**Felter:**
- `id` (PK)
- `beverageId` (FK → Beverage.id)
- `attributeDefinitionId` (FK → AttributeDefinition.id)
- `valueString`
- `valueNumber`
- `valueBoolean`

**Relationer:**
- Tilhører én `Beverage`
- Refererer én `AttributeDefinition`

Kun én værdi-type udfyldes, baseret på attributtens `dataType`.

---

## Brugere og anmeldelser

### User

**Formål:**  
Repræsenterer en bruger.

**Felter:**
- `id` (PK)
- `username`
- `email`
- `password`
- `createdAt`

**Relationer:**
- Har mange `Review`

---

### Review

**Formål:**  
En anmeldelse af en drikkevare.

**Felter:**
- `id` (PK)
- `userId` (FK → User.id)
- `beverageId` (FK → Beverage.id)
- `rating`
- `title`
- `description`
- `createdAt`
- `updatedAt`

**Relationer:**
- Tilhører én `User`
- Tilhører én `Beverage`
- Har mange `ReviewAnswer`

---

## Spørgsmål i anmeldelser

### Question

**Formål:**  
Definerer spørgsmål, der stilles i forbindelse med en anmeldelse.

Eksempler:
- “Hvor bitter er den?”
- “Ville du købe den igen?”

**Felter:**
- `id` (PK)
- `categoryId` (FK → BeverageCategory.id)
- `typeId` (FK → BeverageType.id, nullable)
- `questionText`
- `answerType` (`TEXT | NUMBER | BOOLEAN | SELECT`)
- `options` (JSON)
- `required`
- `sortOrder`

**Regel:**
- Hvis `typeId` er `NULL`, gælder spørgsmålet for alle typer i kategorien.

---

### ReviewAnswer

**Formål:**  
Gemmer brugerens svar på et spørgsmål i en anmeldelse.

**Felter:**
- `id` (PK)
- `reviewId` (FK → Review.id)
- `questionId` (FK → Question.id)
- `answer`

---

## Designprincipper

- Ingen hårdkodede attributter eller spørgsmål
- Nye definitioner kan tilføjes uden datamigrering
- Eksisterende anmeldelser ændres ikke
- Frontend kan bygges fuldt dynamisk
- Klar separation mellem definition og værdi

---

## Videre arbejde

- Implementering i NestJS + Prisma
- Docker-setup med PostgreSQL
- Seed-data for kategorier, typer og attributter
- Dynamisk frontend baseret på definitioner
