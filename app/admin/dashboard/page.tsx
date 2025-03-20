"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaBoxOpen, FaBlog } from "react-icons/fa";

const Dashboard = () => {
  const router = useRouter();
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Check if user is admin, if not redirect to home page
    if (!isAdmin()) {
      router.push("/");
    }
  }, [isAdmin, router]);

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Admin Dashboard</h1>
      <p className="text-center mb-5">
        Welcome to the admin dashboard. Here you can manage products and blog posts.
      </p>

      <Row className="justify-content-center">
        <Col md={5} className="mb-4">
          <Link href="/admin/products" className="text-decoration-none">
            <Card className="h-100 shadow-sm hover-card">
              <Card.Body className="text-center p-5">
                <FaBoxOpen size={50} className="mb-3 text-primary" />
                <Card.Title>Product Management</Card.Title>
                <Card.Text>
                  Add, edit, or remove products from the store inventory
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col md={5} className="mb-4">
          <Link href="/admin/blog" className="text-decoration-none">
            <Card className="h-100 shadow-sm hover-card">
              <Card.Body className="text-center p-5">
                <FaBlog size={50} className="mb-3 text-primary" />
                <Card.Title>Blog Management</Card.Title>
                <Card.Text>
                  Create, edit, or delete blog posts for the website
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      <style jsx global>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </Container>
  );
};

export default Dashboard;