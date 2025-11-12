import {
  Col,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import { NavLink as RRNavLink, useLocation } from "react-router-dom";
import { navData } from "modules/nav.ts";
import "./styles.css";

const Header = () => {
  const location = useLocation();

  return (
    <header>
      <Navbar className="p-3" expand="lg">
        <Container>
          <Row>
            <Col md="6" className="d-flex align-items-center">
              <NavbarBrand tag={RRNavLink} to="/">
                Оценка стоимости облачного хостинга для веб-проекта
              </NavbarBrand>
            </Col>
            <Col
              md="6"
              className="d-flex justify-content-end align-items-center"
            >
              <Nav className="fs-5 gap-3" navbar>
                {navData.map((item, index) => (
                  <>
                    {(index > 0 && (
                      <NavItem>
                        <NavLink tag={RRNavLink} to={item.link} key={index}>
                          {item.page}
                        </NavLink>
                      </NavItem>
                    )) ||
                      (location.pathname !== "/" && (
                        <NavLink tag={RRNavLink} to={item.link} key={index}>
                          🏠 Домой
                        </NavLink>
                      ))}
                  </>
                ))}
              </Nav>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
