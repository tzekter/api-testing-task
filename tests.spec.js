const url = 'https://restful-booker.herokuapp.com';
describe('Restful-Booker API Tests',()=>{
    let token;
    let bookingId;

    const authCredentials = {
        username: 'admin',
        password: 'password123'
    };
    const newBookingData = {
        firstname: 'Anna',
        lastname: 'Shevchenko',
        totalprice: 1110,
        depositpaid: true,
        bookingdates: {
            checkin: '2026-01-03',
            checkout: '2026-04-07'
        },
        additionalneeds: 'Breakfast'
    }

    //Create a token
    test('Should create auth token successfully ', async()=>{
        const response = await fetch(`${url}/auth`,{
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(authCredentials)
        });
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/json');

        const body = await response.json();
        expect(body).toHaveProperty('token');

        token = body.token;
    })

    //Create a Booking
    it('Should create a new booking', async()=>{
        const response = await fetch(`${url}/booking`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newBookingData)
        });
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/json');

        const body = await response.json();
        expect(body).toHaveProperty('bookingid');
        expect(body.booking.firstname).toBe(newBookingData.firstname);
        expect(body.booking.lastname).toBe(newBookingData.lastname);
        
        bookingId = body.bookingid;
    })

    //Get created booking by id
    it('Should get booking by ID', async()=>{
        expect(bookingId).toBeDefined();

        const response = await fetch(`${url}/booking/${bookingId}`,{
            method: 'GET',
            headers: {'Accept': 'application/json'}
        });
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/json');

        const body = await response.json();
        expect(body.firstname).toBe(newBookingData.firstname);
        expect(body.totalprice).toBe(newBookingData.totalprice)
    });

    //Update booking
    it('Should update existing booking', async()=>{
        const updateData = {
            ...newBookingData,
            totalprice: 2500,
            additionalneeds: 'Lunch and Breakfast'
        };
        const response = await fetch(`${url}/booking/${bookingId}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify(updateData)
        });
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/json');

        const body = await response.json();
        expect(body.totalprice).toBe(2500);
        expect(body.additionalneeds).toBe('Lunch and Breakfast');
    });

    //Remove booking
    it('Should delete booking', async()=>{
        const response = await fetch(`${url}/booking/${bookingId}`,{
            method: 'DELETE',
            headers: {'Cookie': `token=${token}`}
        });
        expect(response.status).toBe(201);
        const textBody = await response.text();
        expect(textBody).toBe('Created');
    })
})