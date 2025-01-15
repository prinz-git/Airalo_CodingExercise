import { isExpired } from '../support/helpers';
import testInputs from '../fixtures/testInputs.json';

describe('E-Sims Order Creation and Validation', () => {
  // Global variables for test data and token
  let accessToken = null;
  let orderId = null;
  const { description, package_id, quantity } = testInputs.eSimOrder;

  /**
   * Request or retrieve a valid access token before running tests
   */
  before(() => {
    const savedToken = Cypress.env('accessToken');
    
    // Check if a valid token is already available
    if (savedToken && !isExpired(savedToken)) {
      accessToken = savedToken;
    } else {
      // Request a new token if none exists or if expired
      requestAccessToken().then((token) => {
        accessToken = token;
        Cypress.env('accessToken', accessToken); // Save the token for reuse
      });
    }
  });

  /**
   * Create an E-Sim order and validate the response
   */
  it(`Create an E-Sim order with ${quantity} units`, () => {
    createESimOrder(accessToken, { description, package_id, quantity }).then((response) => {
      expect(response.status).to.eq(200); // Ensure the API call was successful
      orderId = response.body.data.id; // Store the created order ID
      cy.log(`Order successfully created with ID: ${orderId}`);
    });
  });

  /**
   * Fetch and validate E-Sim orders against the created order
   */
  it('Fetch and validate the created E-Sim order data', () => {
    getESimOrders(accessToken, quantity).then((response) => {
      expect(response.status).to.eq(200); // Ensure the API call was successful
      validateESimOrderData(response.body.data, { description, package_id, orderId });
    });
  });

  /**
   * Helper function: Request a new access token
   */
  function requestAccessToken() {
    const clientId = Cypress.env('clientId');
    const clientSecret = Cypress.env('clientSecret');
    const grantType = 'client_credentials';

    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiBaseUrl')}/v2/token`, // Airalo API token URL
      body: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: grantType,
      },
      form: true,
    }).then((response) => {
      expect(response.status).to.eq(200); // Ensure the token request was successful
      const token = response.body.data.access_token;
      expect(token).to.be.a('string').and.not.to.be.empty; // Validate token format
      return token;
    });
  }

  /**
   * Helper function: Create an E-Sim order
   */
  function createESimOrder(token, { description, package_id, quantity }) {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiBaseUrl')}/v2/orders`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      form: true, // Ensure form data is sent correctly
      body: {
        quantity: `${quantity}`,
        package_id,
        type: 'sim',
        description,
        brand_settings_name: null,
      },
    });
  }

  /**
   * Helper function: Fetch E-Sim orders
   */
  function getESimOrders(token, quantity) {
    return cy.request({
      method: 'GET',
      url: `${Cypress.env('apiBaseUrl')}/v2/sims`,
      qs: {
        limit: quantity,
        page: '1',
        include: 'order',
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Helper function: Validate E-Sim order data
   */
  function validateESimOrderData(simsData, { description, package_id, orderId }) {
    simsData.forEach((item) => {
      expect(item.simable.package_id).to.eq(package_id); // Validate package ID
      expect(item.simable.id).to.eq(orderId); // Validate order ID
      expect(item.simable.description).to.eq(description); // Validate description
    });
  }
});
