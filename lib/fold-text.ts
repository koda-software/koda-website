/** Lower-case, without accents, so "żółć" and "zolc" compare equal. */
export function foldText(value: string) {
  return value.toLowerCase().replaceAll("ł", "l").normalize("NFD").replace(/\p{M}/gu, "");
}
