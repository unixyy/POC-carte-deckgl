# Documentation pour l'ajout de données GeoJSON et l'exécution du projet

## Ajouter des données GeoJSON

un fichier d'exemple vous est fourni dans le projet au à l'emplacement suivant :
`src/assets/points_v4_allveltime.geojson`

1. Placez votre fichier GeoJSON dans le dossier `src/assets` du projet React.  
  Exemple : `src/assets/points_v4_allveltime.geojson`

2. Dans le fichier `App.tsx`, modifiez le fonctionnement du `useEffect` pour charger le fichier GeoJSON :
  ```js
    useEffect(() => {
    fetch("/points_v4_allveltime.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        setGeojsonData(geojson);

        console.log("GeoJSON data fetched:", geojson);

        setQuantiles(geojson.properties.quantiles || []);
        console.log("Quantiles computed:", geojson.properties.quantiles);
      });
  }, []);
  ```
## Exécuter le projet

le projet utilise Vite pour le développement. Voici les étapes pour, et à utilisé bun.sh comme gestionnaire de paquets. néanmoins vous pouvez utiliser npm pour le faire fonctionner

1. Installez les dépendances du projet :
  ```bash
  npm install
  ```

2. Lancez le serveur de développement :
  ```bash
  npm run dev
  ```

3. Accédez à l'application dans votre navigateur à l'adresse [http://localhost:5173](http://localhost:5173).

---
**Remarque :**  
Assurez-vous que le nom du fichier dans le dossier `public` correspond exactement à celui utilisé dans la fonction `fetch`.

Il est important de noter que la Preuve de Concept (POC) ici présente est adaptés aux données GeoJSON fournies dans ``src/assets/points_v4_allveltime.geojson``. Pour utiliser d'autres données GeoJSON, il faudra adapter le code présent dans `App.tsx` pour correspondre à la structure de vos données.