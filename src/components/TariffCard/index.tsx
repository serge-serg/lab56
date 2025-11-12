import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "assets/mock.png";
import {Link} from "react-router-dom";
import {T_Tariff} from "modules/types.ts";
import './styles.css'

interface TariffCardProps {
    tariff: T_Tariff,
    isMock: boolean
}

const TariffCard = ({tariff, isMock}: TariffCardProps) => {
    return (
        <Card key={tariff.id}>
            <CardImg
                src={isMock ? mockImage as string : tariff.image}
                //style={{"height": "200px"}}
            />
            <CardBody className="d-flex flex-column justify-content-between">
                <CardTitle tag="h5">
                    {tariff.name}
                </CardTitle>
                <CardText>
                    Цена: {tariff.price} руб.
                </CardText>
                <Link to={`/tariffs/${tariff.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default TariffCard
