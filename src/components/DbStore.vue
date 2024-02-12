<script>
import parsedImages from "../data/pics-dummy.json";
// import parsedImages from "../data/pics-parsed.json";
export default {
  data() {
    return {
      items: [],
      db: null,
      dbName: "never_forget_db",
      storeName: "imageStore",
      loading: true,
    };
  },
  created() {
    if (!("indexedDB" in window)) {
      console.error("This browser does not support IndexedDB");
      return;
    }

    const request = indexedDB.open(this.dbName);

    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.fetchDataFromDatabase();
    };

    request.onerror = (event) => {
      console.error("Error opening database", event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  },
  methods: {
    fetchDataFromDatabase() {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = (event) => {
        const data = event.target.result;
        if (data.length === 0) {
          this.insertDataIntoDatabase(parsedImages);
        } else {
          this.items = data;
          this.loading = false;
        }
      };

      request.onerror = (event) => {
        console.error("Error fetching data from database", event.target.error);
      };
    },
    insertDataIntoDatabase(data) {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      data.forEach((item) => {
        store.add(item);
      });

      transaction.oncomplete = () => {
        console.log("Data inserted into database successfully");
        this.items = data;
        this.loading = false;
      };

      transaction.onerror = (event) => {
        console.error("Error inserting data into database", event.target.error);
      };
    },
    // updateDataInDatabase(updatedItem) {
    //   const transaction = this.db.transaction([this.storeName], "readwrite");
    //   const store = transaction.objectStore(this.storeName);
    //   const request = store.put(updatedItem);

    //   transaction.oncomplete = () => {
    //     console.log("Data updated in database successfully");
    //     // Optional: Update the corresponding item in the items array
    //   };

    //   transaction.onerror = (event) => {
    //     console.error("Error updating data in database", event.target.error);
    //   };
    // },
    // loadDataFromFileIfNeeded() {
    //   this.insertDataIntoDatabase(parsedImages);
    // },
  },
};
</script>
