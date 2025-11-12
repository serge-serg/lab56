// сделаем навигацию расширяемой в будущем
interface Crumb {
  page: string;
  link: string;
}

const navData: Crumb[] = [
  { page: "Главная", link: "/" },
  { page: "Тарифы", link: "/tariffs" },
];

export { navData };
