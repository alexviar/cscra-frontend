import { Col, Row } from "react-bootstrap"
import { FaUserCircle, FaClinicMedical, FaCalendar } from "react-icons/fa"
import { MenuItem } from "./MenuItem"

export const Home = () => {
  return <div>
    <div className="pt-5 d-flex justify-content-center">
      <img src="/logo.png" width={240} />
    </div>
    <div className="text-center mt-3 py-2 px-3 bg-primary">
      <h1 className="text-light" style={{fontSize: "1.5rem"}}>Aplicaciones</h1>
      <Row>
        <Col>
          <div className="d-flex justify-content-center">
            <MenuItem to="/iam" className="text-center text-light">
              <FaUserCircle size={96} />
              <span className="d-block my-2">IAM</span>
            </MenuItem>
          </div>
        </Col>
        <Col>
          <div className="d-flex justify-content-center">
            <MenuItem to="/clinica" className="text-center text-light">
              <FaClinicMedical size={96}/>
              <span className="d-block my-2">Clinica</span>
            </MenuItem>
          </div>
        </Col>
        <Col>
          <div className="d-flex justify-content-center">
            <MenuItem to="/seguimiento" className="text-center text-light">
              <FaCalendar size={96}/>
              <span className="d-block my-2">Seguimiento</span>
            </MenuItem>
          </div>
        </Col>
      </Row>
    </div>
  </div>
}