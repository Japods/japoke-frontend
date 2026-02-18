import { useEffect } from 'react';
import useCatalogStore from '../store/useCatalogStore';

export default function useCatalog() {
  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return { loading, error };
}
