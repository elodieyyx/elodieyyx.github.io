import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Paperclip } from "react-bootstrap-icons";
import polaroidImg from "../../assets/img/photo_2025-12-08_22-31-35.jpg";
import "./Banner.css";

export default function Banner() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <section className={`banner${isLoaded ? " loaded" : ""}`} id="home">
            <Container>
                <Row className="align-items-center justify-content-center">
                    {/* Left Column: Polaroid Image */}
                    <Col xs={5} md={5} xl={4} className="mb-0 mb-md-0">
                        <div className="polaroid-wrapper">
                            <div className="polaroid-frame">
                                <img src={polaroidImg} alt="Polaroid of me" className="img-fluid" />
                                <Paperclip className="paperclip-icon" size={40} />
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: Text Content */}
                    <Col xs={7} md={7} xl={6}>
                        <div className="content-wrapper ps-md-5">
                            <h1 className="hello-title">hello!</h1>

                            <div className="info-grid">
                                <div className="info-row">
                                    <span className="label">NAME:</span>
                                    <span className="value">Elodie Yeung</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">AGE:</span>
                                    <span className="value">20</span>
                                </div>
                                <div className="info-row align-items-start">
                                    <span className="label">CURRENTLY:</span>
                                    <span className="value">
                                        Learning as much as I can!<br />
                                        <span className="highlight-red">(and mildly spiraling)</span>
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">LIFE GOAL:</span>
                                    <span className="value">Build fun projects that I can be proud of!</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};