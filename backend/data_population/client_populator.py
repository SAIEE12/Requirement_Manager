# app/data_population/client_populator.py
from sqlalchemy.orm import Session
from app.crud.client import create_client
from app.schemas.client import ClientCreate

def populate_clients(db: Session):
    clients = [
        {
            "name": "Qualcomm",
            "industry": "Telecommunications",
            "contact_person": "John Doe",
            "email": "john.doe@qualcomm.com",
            "phone": "123-456-7890"
        },
        {
            "name": "AMD",
            "industry": "Semiconductors",
            "contact_person": "Jane Smith",
            "email": "jane.smith@amd.com",
            "phone": "234-567-8901"
        },
        {
            "name": "Xilinx",
            "industry": "Semiconductors",
            "contact_person": "Bob Johnson",
            "email": "bob.johnson@xilinx.com",
            "phone": "345-678-9012"
        },
        {
            "name": "NXP",
            "industry": "Semiconductors",
            "contact_person": "Alice Brown",
            "email": "alice.brown@nxp.com",
            "phone": "456-789-0123"
        },
        {
            "name": "Samsung",
            "industry": "Electronics",
            "contact_person": "Charlie Davis",
            "email": "charlie.davis@samsung.com",
            "phone": "567-890-1234"
        },
        {
            "name": "Micron",
            "industry": "Semiconductors",
            "contact_person": "Eva White",
            "email": "eva.white@micron.com",
            "phone": "678-901-2345"
        },
        {
            "name": "LG",
            "industry": "Electronics",
            "contact_person": "Frank Green",
            "email": "frank.green@lg.com",
            "phone": "789-012-3456"
        },
        {
            "name": "Silicon Labs",
            "industry": "Semiconductors",
            "contact_person": "Grace Lee",
            "email": "grace.lee@silabs.com",
            "phone": "890-123-4567"
        }
    ]

    for client_data in clients:
        client = ClientCreate(**client_data)
        create_client(db, client)
        print(f"Created client: {client_data['name']}")