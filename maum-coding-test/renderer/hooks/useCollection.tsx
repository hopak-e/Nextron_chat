import {
  CollectionReference,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useCollection(
  key: string,
  collection: CollectionReference
) {
  const [data, setData] = useState<QuerySnapshot<DocumentData> | null>(null);

  useEffect(() => {
    const snap = onSnapshot(collection, (snapshot) => {
      setData(snapshot);
    });
    return () => {
      snap();
    };
  }, [key]);

  return { data };
}
