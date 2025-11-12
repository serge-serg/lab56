import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { T_Tariff } from "modules/types.ts";
import { navData } from "modules/nav.ts";
import "./styles.css";
//import { link } from "fs";

interface Props {
  selectedTariff: T_Tariff | null;
}

const Breadcrumbs = ({ selectedTariff }: Props) => {
  const location = useLocation();

  const paths = location.pathname === "/" ? [""] : location.pathname.split("/");

  const getBreadCrumb = (segment: string) => {
    if (paths.length === 1) {
      return {
        activeLink: "/",
        activePage: "Главная",
      };
    }
    
    if (paths.length > 1 && segment === "") {
      return null;
    }

    const activeSegment = navData.find((e) => e.link === `/${segment}`);

    return {
      activeLink: activeSegment?.link,
      activePage: activeSegment?.page,
    };
  };

  return (
    <Breadcrumb className="fs-5">
      {paths.map((segment, index) => {
        if (index === 2) {
          // возвращаем неразрывный пробел, чтобы он занял место перед слэшем в breadcrumbs на стр. выбранного тарифа
          return <>&nbsp;</>;
        }
        const activeData = getBreadCrumb(segment);

        if (!activeData) return null;

        return (
          <BreadcrumbItem key={index}>
            <Link to={`${activeData?.activeLink}`}>
              {activeData?.activePage}
            </Link>
          </BreadcrumbItem>
        );
      })}
      {selectedTariff && ` / ${selectedTariff.name}`}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
