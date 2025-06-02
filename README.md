# pinecone-cheat-sheet

# docs

## llm
- https://docs.pinecone.io/llms.txt
- https://docs.pinecone.io/llms-full.txt








<br><br>
________
________
<br><br>




## Was sind Namespaces, Indexes & Co. bei Pinecone? (Erklärung für MongoDB-Umsteiger)

<details><summary>Click to expand..</summary>


Okay, jetzt zur ausführlichen Erklärung, damit du die Konzepte von Pinecone im Vergleich zu MongoDB verstehst.

Stell dir die Hierarchie bei Pinecone so vor (von oben nach unten):

1.  **Organization (Organisation):**
    *   Das ist die höchste Ebene. Eine Organisation bündelt mehrere Projekte und ist primär für die Abrechnung (`Billing`) und die Verwaltung von Benutzern auf Organisationsebene zuständig.
    *   *MongoDB-Analogie:* Am ehesten vergleichbar mit deinem gesamten MongoDB Atlas Account oder einer übergeordneten Firmeneinheit, die mehrere Datenbank-Deployments verwaltet.

2.  **Project (Projekt):**
    *   Ein Projekt gehört zu einer Organisation und enthält einen oder mehrere Indexes. API-Keys sind projektspezifisch. Du kannst Projekte nutzen, um verschiedene Anwendungen oder Stages (dev, staging, prod) voneinander zu trennen.
    *   *MongoDB-Analogie:* Ein Projekt ist eine logische Gruppierung. Es gibt hier keine direkte Entsprechung. Man könnte es vielleicht mit einem Cluster oder einer Gruppe von Clustern für eine bestimmte Anwendungssuite vergleichen, aber die Analogie hinkt etwas. Wichtig ist: Ein Projekt enthält deine Pinecone Indexes.

3.  **Index:**
    *   **Das ist die zentrale Datenstruktur in Pinecone, in der deine Vektor-Embeddings gespeichert werden.** Wenn du einen Index erstellst, definierst du dessen Eigenschaften, vor allem:
        *   **Dimension:** Die Anzahl der Dimensionen deiner Vektoren (z.B. 1536 für OpenAI's `text-embedding-ada-002`). Alle Vektoren in einem Index müssen dieselbe Dimension haben.
        *   **Metrik:** Die Ähnlichkeitsmetrik, die für Vergleiche verwendet wird (z.B. `cosine`, `euclidean`, `dotproduct`).
        *   **Typ:** Pinecone unterscheidet zwischen `dense` und `sparse` Indizes.
            *   **Dense Index:** Speichert dichte Vektoren (Dense Vectors), die typischerweise für semantische Ähnlichkeit verwendet werden. Jede Zahl im Vektor hat eine Bedeutung.
            *   **Sparse Index:** Speichert dünnbesetzte Vektoren (Sparse Vectors), die oft für lexikalische oder Keyword-basierte Suchen genutzt werden (ähnlich wie BM25). Hier sind viele Dimensionen Null.
    *   Ein Index ist die höchste Ebene der Datenorganisation *innerhalb eines Projekts*.
    *   *MongoDB-Analogie:* Ein Pinecone **Index** ist am ehesten vergleichbar mit einer **MongoDB Datenbank** (z.B. `meineAnwendungsDB`). Er ist der Hauptcontainer für eine bestimmte Art von Vektordaten (definiert durch Dimension und Metrik). Du würdest typischerweise weniger Pinecone Indexes haben als du vielleicht MongoDB Datenbanken in einem sehr großen System hättest. **Wichtig:** Ein Pinecone Index ist NICHT dasselbe wie ein Index in MongoDB (der zur Beschleunigung von Queries auf Feldern dient).

4.  **Namespace:**
    *   **Ein Namespace ist eine Partition *innerhalb* eines Indexes.** Er dient dazu, die Vektoren (Records) in einem Index in separate Gruppen aufzuteilen.
    *   **Alle Operationen** (Upsert, Query, Delete etc.) beziehen sich immer auf **genau einen Namespace** innerhalb eines Indexes (oder auf den Default-Namespace, wenn keiner angegeben wird).
    *   **Implizite Erstellung:** Namespaces müssen nicht explizit erstellt werden. Wenn du Daten in einen Namespace hochlädst (`upsert`), der noch nicht existiert, wird er automatisch angelegt.
    *   **Anwendungsfälle:**
        *   **Mandantenfähigkeit (Multitenancy):** Der häufigste Anwendungsfall. Jeder deiner Kunden bekommt seinen eigenen Namespace im selben Index. So bleiben die Daten logisch getrennt, und Abfragen eines Kunden A sehen nicht die Daten von Kunde B.
        *   **Schnellere Abfragen:** Durch die Partitionierung können Abfragen schneller sein, da nur ein Teil des Indexes durchsucht werden muss.
        *   **Logische Gruppierung:** Du könntest z.B. verschiedene Dokumenttypen (Artikel, Produktbeschreibungen) in unterschiedliche Namespaces packen, wenn sie dieselbe Vektor-Dimension und Metrik haben.
    *   *MongoDB-Analogie:* Ein Pinecone **Namespace** ist sehr gut vergleichbar mit einer **MongoDB Collection** (z.B. `users`, `products` innerhalb deiner Datenbank `meineAnwendungsDB`). Er unterteilt die Daten *innerhalb* eines Pinecone Indexes (der ja wie eine MongoDB Datenbank ist). Alle Records in einem Namespace teilen sich die Dimension und Metrik des übergeordneten Indexes.
    *   **Ist ein Namespace sowas wie eine Datenbank?**
        **Nein.** Ein Pinecone **Index** ist wie eine Datenbank. Ein **Namespace** ist wie eine **Collection** innerhalb dieser Datenbank.

5.  **Record (Datensatz):**
    *   Ein Record ist die Grundeinheit der Daten in Pinecone. Jeder Record besteht aus:
        *   **Record ID:** Eine eindeutige ID für den Record innerhalb seines Namespaces.
        *   **Vector Values:** Die eigentlichen Vektor-Embeddings (entweder Dense oder Sparse, je nach Index-Typ).
        *   **Metadata (optional):** Zusätzliche Informationen als Key-Value-Paare (JSON-Objekt), die du mit dem Vektor speichern kannst. Metadaten können für Filterung bei Abfragen genutzt werden oder um Kontext zum Vektor zu speichern (z.B. den Originaltext, aus dem das Embedding erstellt wurde).
    *   *MongoDB-Analogie:* Ein Pinecone **Record** ist vergleichbar mit einem **MongoDB Dokument**. Es hat eine ID, die Vektorwerte (deine primären Daten für die Suche) und Metadaten (ähnlich wie Felder in einem MongoDB-Dokument).

**Zusammenfassende Tabelle der Analogien:**

| Pinecone-Konzept       | Am ehesten vergleichbar mit MongoDB...          | Hauptfunktion in Pinecone                                                                  |
| :--------------------- | :---------------------------------------------- | :----------------------------------------------------------------------------------------- |
| Organization           | Account / Übergeordnete Einheit                 | Abrechnung, Benutzerverwaltung auf höchster Ebene                                          |
| Project                | Logische Anwendungsgruppe / Teil eines Clusters | Container für Indexes, API-Key-Verwaltung                                                  |
| **Index**              | **Datenbank** (z.B. `meineAnwendungsDB`)        | Hauptcontainer für Vektoren; definiert Dimension & Metrik                                    |
| **Namespace**          | **Collection** (z.B. `users`, `products`)       | Partitionierung von Records *innerhalb* eines Indexes; für Mandantenfähigkeit, Organisation |
| **Record**             | **Dokument**                                    | Einzelner Datensatz bestehend aus ID, Vektor und Metadaten                                 |
| Vektor (Dense/Sparse)  | Spezielle Datenfelder (nicht direkt analog)     | Numerische Repräsentation von Daten für Ähnlichkeitssuche                                  |
| Metadaten              | Felder in einem Dokument                        | Zusatzinformationen zu einem Vektor, filterbar                                             |


</details>

















<br><br>
________
________
<br><br>

# API

<details><summary>Click to expand..</summary>

<br><br>

# listIndexes
- This operation returns a list of all indexes in a project.
- https://docs.pinecone.io/reference/api/2024-07/control-plane/list_indexes

<details><summary>Click to expand..</summary>

Example:
```
// npm install @pinecone-database/pinecone
import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

await pc.listIndexes();
```

Response:
```
{
  "indexes": [
    {
      "dimension": 384,
      "host": "semantic-search-c01b5b5.svc.us-west1-gcp.pinecone.io",
      "metric": "cosine",
      "name": "semantic-search",
      "spec": {
        "pod": {
          "environment": "us-west1-gcp",
          "pod_type": "p1.x1",
          "pods": 4,
          "replicas": 2,
          "shards": 2
        }
      },
      "status": {
        "ready": true,
        "state": "Ready"
      }
    },
    {
      "dimension": 200,
      "host": "image-search-a31f9c1.svc.us-east1-gcp.pinecone.io",
      "metric": "dotproduct",
      "name": "image-search",
      "spec": {
        "serverless": {
          "cloud": "aws",
          "region": "us-east-1"
        }
      },
      "status": {
        "ready": false,
        "state": "Initializing"
      }
    }
  ]
}
```

</details>

</details>


