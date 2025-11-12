import { Button, Col, Container, Form, Input, Row } from "reactstrap";
import { T_Tariff } from "src/modules/types.ts";
import TariffCard from "components/TariffCard";
import { TariffMocks } from "src/modules/mocks.ts";
import { FormEvent, useEffect, useCallback } from "react";
import * as React from "react";
import "./styles.css";
import { useDispatch } from "react-redux";
import { setFilter } from "src/store/filterSlice.ts";
import type { AppDispatch } from "src/store/index.ts";

type Props = {
  tariffs: T_Tariff[];
  setTariffs: React.Dispatch<React.SetStateAction<T_Tariff[]>>;
  isMock: boolean;
  setIsMock: React.Dispatch<React.SetStateAction<boolean>>;
  tariffName: string;
  setTariffName: React.Dispatch<React.SetStateAction<string>>;
};

const TariffsListPage = ({
  tariffs,
  setTariffs,
  isMock,
  setIsMock,
  tariffName,
  setTariffName,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const filterTariffs = (name: string) => {
    setTariffName(name);
    dispatch(setFilter(name));
  };

  const createMocks = useCallback(() => {
    setIsMock(true);
    setTariffs(
      TariffMocks.filter((tariff) =>
        tariff.name.toLowerCase().includes(tariffName.toLowerCase())
      )
    );
  }, [tariffName, setIsMock, setTariffs]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/tariffs/?tariff_name=${tariffName.toLowerCase()}`
      );
      const data = await response.json();
      setTariffs(data);
      setIsMock(false);
    } catch {
      createMocks();
    }
  }, [tariffName, setTariffs, setIsMock, createMocks]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isMock) {
      createMocks();
    } else {
      await fetchData();
    }
  };

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <Container>
      <Row className="mb-5">
        <Col md="6">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="8">
                <Input
                  value={tariffName}
                  onChange={(e) => filterTariffs(e.target.value)}
                  placeholder="Поиск..."
                ></Input>
              </Col>
              <Col>
                <Button color="primary" className="w-100 search-btn">
                  Поиск
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        {tariffs?.map((tariff) => (
          <Col key={tariff.id} xs="4">
            <TariffCard tariff={tariff} isMock={isMock} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TariffsListPage;
