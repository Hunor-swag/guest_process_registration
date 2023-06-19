import { ChangeEvent, useEffect, useState } from "react";
import en from "@/dictionaries/en.json";
import hu from "@/dictionaries/hu.json";
import { Language } from "@/types/typings";
import { useLocalStorage } from "./useLocalStorage";

export default function useDictionary() {
  const [lang, setLang] = useLocalStorage("lang", {
    key: "en",
    value: "English",
  });
  const [dict, setDict] = useState(en);
  useEffect(() => {
    switch (lang.key) {
      case "hu":
        setDict(hu);
        break;
      case "en":
        setDict(en);
        break;
      default:
        break;
    }
  }, []);
  return dict;
}
