// DataFetchPage.js
import React, { useEffect } from 'react';
import { useData } from './DataContext';

function DataFetchPage() {
  const { setData } = useData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/etablissements/getChambre');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, [setData]);

  return <div>Chargement des données en cours...</div>;
}

export default DataFetchPage;
