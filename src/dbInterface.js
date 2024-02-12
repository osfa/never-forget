export function openDatabase(
  dbName,
  storeName,
  successCallback,
  errorCallback
) {
  const request = indexedDB.open(dbName);

  request.onsuccess = (event) => {
    const db = event.target.result;
    successCallback(db);
  };

  request.onerror = (event) => {
    console.error("Error opening database", event.target.error);
    errorCallback(event.target.error);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
    }
  };
}

export function fetchDataFromDatabase(
  db,
  storeName,
  successCallback,
  errorCallback
) {
  const transaction = db.transaction([storeName], "readonly");
  const store = transaction.objectStore(storeName);
  const request = store.getAll();

  request.onsuccess = (event) => {
    // insert if empty? and return that instead?
    successCallback(event.target.result);
  };

  request.onerror = (event) => {
    console.error("Error fetching data from database", event.target.error);
    errorCallback(event.target.error);
  };
}

export function insertDataIntoDatabase(
  db,
  storeName,
  data,
  successCallback,
  errorCallback
) {
  const transaction = db.transaction([storeName], "readwrite");
  const store = transaction.objectStore(storeName);

  data.forEach((item) => {
    store.add(item);
  });

  transaction.oncomplete = () => {
    console.log("Data inserted into database successfully");
    successCallback();
  };

  transaction.onerror = (event) => {
    console.error("Error inserting data into database", event.target.error);
    errorCallback(event.target.error);
  };
}
