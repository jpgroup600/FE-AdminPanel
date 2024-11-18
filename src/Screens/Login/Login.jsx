import React, { useState } from "react";
import { Button, Modal, Card, Form } from "react-bootstrap";
import "./Login.css";
import axios from "axios";
import { BackEndAPI } from "../../BaseURI/BackEndUrI";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const handleVerification = async () => {
        try {
            const response = await axios.post(`${BackEndAPI}/adminroutes/login`, {
                email,
                password,
            });

            if (response.status === 200) {
                navigate("/home");
            } else {
                setAlertMessage(response.data.message || "Login failed. Please try again.");
                setShowModal(true);
                console.log("error", response.data.message);
            }
        } catch (error) {
            setAlertMessage("An error occurred. Please try again.");
            setShowModal(true);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Card.Body>
                    <Card.Title className="login-heading">Login</Card.Title>
                    <Form>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                required
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            onClick={handleVerification}
                            className="login-button"
                        >
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Modal for Error Notifications */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{alertMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Login;
