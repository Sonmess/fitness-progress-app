import { useNuxtApp, useState } from "#app";
import { type BodyPart } from "~/types";
import {
  collection,
  Firestore,
  getDocs,
  type DocumentData,
} from "firebase/firestore";

export const useBodyParts = () => {
  const { $firestore } = useNuxtApp();
  const bodyPartsCache = useState<BodyPart[]>("bodyPartsCache", () => []);

  const fetchBodyParts = async () => {
    if (bodyPartsCache.value.length > 0) {
      return;
    }

    try {
      const collectionRef = collection($firestore as Firestore, "bodyParts");
      const snapshot = await getDocs(collectionRef);
      const partsList: BodyPart[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        partsList.push({
          id: doc.id,
          name: data.name,
          imageUrl: data.imageUrl || "",
        });
      });

      partsList.sort((a, b) => a.name.localeCompare(b.name));
      bodyPartsCache.value = partsList;
    } catch (error) {
      console.error("Error fetching body parts: ", error);
    }
  };

  return {
    bodyParts: bodyPartsCache,
    fetchBodyParts,
  };
};
