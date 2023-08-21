export class IndexedDBService {
  private readonly dbConfig: { name: string, version: number, objName: string };

  constructor(init: { name: string, version: number, objName: string },) {
    const data = {
      ...init,
    };

    this.dbConfig = { ...data };
  }

  connectToIndexedDB(
    objStoreOptions: IDBObjectStoreParameters,
    indexOptions: {
      name: string;
      keyPath: string;
      options?: IDBIndexParameters
    },
  ) {
    const { name, version, objName } = this.dbConfig;

    const request = indexedDB.open(name, version);

    // Create object store and indexes
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore(objName, objStoreOptions);
      const { name, keyPath, options = { unique: false } } = indexOptions;
      objectStore.createIndex(name, keyPath, options);
    };

    // Handle connection errors
    request.onerror = (event: any) => {
      console.error('Database error:', event.target.error);
    };
  }

  addDataToIndexDB<T>(data: T[]) {
    const { name, version, objName } = this.dbConfig;
    const request = indexedDB.open(name, version);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction([objName], 'readwrite');
      const objectStore = transaction.objectStore(objName);
      data.forEach((item) => {
        objectStore.put(item);
      });
      transaction.oncomplete = () => {
        console.log('Data added to the object store');
      };
      transaction.onerror = (event: any) => {
        console.error('Transaction error:', event.target.error);
      };
    };
  }

  count(): Promise<number> {
    const { name, version, objName } = this.dbConfig;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction([objName], 'readonly');
        const objectStore = transaction.objectStore(objName);
        const countRequest = objectStore.count();

        countRequest.onsuccess = () => {
          const count = countRequest.result;
          resolve(count);
        };

        countRequest.onerror = () => {
          reject(countRequest.error);
        };
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  query<T>(search: string, page: number, limit: number, keyName: string) {
    const { name, version, objName } = this.dbConfig;
    return new Promise<T[]>((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction([objName], 'readonly');
        const objectStore = transaction.objectStore(objName);
        const lowerBound = (page - 1) * limit;
        const upperBound = lowerBound + limit - 1;

        const results: T[] = [];
        let counter = 0;

        objectStore.openCursor().onsuccess = (event: any) => {
          const cursor = event.target.result;
          if (cursor && counter < upperBound) {
            const record = cursor.value;
            const matchesSearchTerm = search ? record[keyName].toLowerCase().includes(search.toLowerCase()) : true;

            if (matchesSearchTerm && counter >= lowerBound) {
              results.push(record);
            }

            counter++;
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        transaction.onerror = (event: any) => {
          console.error('Transaction error:', event.target.error);
          reject(event.target.error);
        };
      };
    });
  }

  clearDataFromIndexedDB() {
    const { name, version, objName } = this.dbConfig;
    const request = indexedDB.open(name, version);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction([objName], 'readwrite');
      const objectStore = transaction.objectStore(objName);
      const clearRequest = objectStore.clear();
      clearRequest.onsuccess = () => {
        console.log('Data cleared from the object store');
      };
      clearRequest.onerror = (event: any) => {
        console.error('Clear data error:', event.target.error);
      };
    };
  }
}
