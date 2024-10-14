from sqlalchemy.orm import Session
from app.crud.client import create_client, get_client_by_email
from app.schemas.client import ClientCreate

def populate_clients(db: Session):
    clients = [
        {"name": "Qualcomm", "industry": "Semiconductors", "contact_person": "John Doe", "email": "john.doe@qualcomm.com", "phone": "1234567890"},
        {"name": "AMD", "industry": "Semiconductors", "contact_person": "Jane Smith", "email": "jane.smith@amd.com", "phone": "2345678901"},
        {"name": "Samsung", "industry": "Electronics", "contact_person": "Park Lee", "email": "park.lee@samsung.com", "phone": "3456789012"},
        {"name": "LGSoft", "industry": "Electronics", "contact_person": "Kim Lee", "email": "kim.lee@lg.com", "phone": "4567890123"},
        {"name": "NXP", "industry": "Semiconductors", "contact_person": "Mike Johnson", "email": "mike.johnson@nxp.com", "phone": "5678901234"},
        {"name": "Micron", "industry": "Semiconductors", "contact_person": "Sarah Brown", "email": "sarah.brown@micron.com", "phone": "6789012345"},
        {"name": "Blaize", "industry": "Semiconductors", "contact_person": "Sarah ", "email": "sarah3.brown@micron.com", "phone": "6589012345"},
        {"name": "SEG", "industry": "Semiconductors", "contact_person": "Sarah Bwn", "email": "sarah1.brown@micron.com", "phone": "6989012345"},
        {"name": "Viseton", "industry": "Semiconductors", "contact_person": "Sarah own", "email": "sarah2.brown@micron.com", "phone": "7789012345"},
        {"name": "MethodeElectronics", "industry": "Semiconductors", "contact_person": "Sarah owns", "email": "sarah4.brown@micron.com", "phone": "9789012345"},
        {"name": "N/A", "industry": "Semiconductors", "contact_person": "Sarah on", "email": "sarah5.brown@micron.com", "phone": "5789012345"},
        
    ]

    for client_data in clients:
        existing_client = get_client_by_email(db, client_data["email"])
        if not existing_client:
            client = ClientCreate(**client_data, is_active=True)
            create_client(db, client)
            print(f"Created client: {client.name}")
        else:
            print(f"Client {client_data['name']} already exists")

def run_client_population(db: Session):
    print("Populating clients...")
    populate_clients(db)
    print("Client population completed")