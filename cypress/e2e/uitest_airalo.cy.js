import testInputs from '../fixtures/testInputs.json';

describe('Buy an E-sim package', () => {
    const elementSelectors = {
      acceptCookiesButton: 'button#onetrust-accept-btn-handler',
      searchInputField: 'input[data-testid="search-input"]',
      searchSuggestionsList: 'ul.countries-list',
      countryFlagSelector: (country) => `[data-testid="${country}-flag"]`,
      countryNameSelector: (country) => `[data-testid="${country}-name"]`,
      esimItemCards: '.sim-item-link',
      esimDetailPopup: '[data-testid="sim-detail-header"]',
      esimDetailsFields: {
        operatorTitle: '[data-testid="sim-detail-operator-title"]',
        coverageValue: '[data-testid="COVERAGE-value"]',
        dataValue: '[data-testid="DATA-value"]',
        validityValue: '[data-testid="VALIDITY-value"]',
        priceValue: '[data-testid="PRICE-value"]',
      },
    };
  
    beforeEach(() => {
      cy.clearCookies();
      cy.visit('/');
    });
  
    // Function to accept cookies on the homepage
    function acceptCookiesBanner() {
      cy.get(elementSelectors.acceptCookiesButton).click({ force: true });
    }
  
    // Function to search for a country and validate navigation
    function searchForCountry({ searchQuery, searchSegment, selectedCountry }) {
      cy.get(elementSelectors.searchInputField).clear().type(searchQuery);
      cy.get(elementSelectors.searchSuggestionsList).should('be.visible');
      cy.get(elementSelectors.searchSuggestionsList)
        .within(() => {
          cy.contains('p', searchSegment)
            .closest('li')
            .next()
            .within(() => {
              cy.get(elementSelectors.countryFlagSelector(selectedCountry)).should('be.visible');
              cy.get(elementSelectors.countryNameSelector(selectedCountry)).should('be.visible').click();
            });
        });
      cy.url().should('include', `/${selectedCountry.toLowerCase()}`);
    }
  
    // Function to select an eSIM item from the list
    function selectEsimItemWithBuyNow() {
      cy.get(elementSelectors.esimItemCards)
        .should('be.visible')
        .filter(':has(button:contains("BUY NOW"))')
        .first()
        .within(() => {
          cy.get('button').contains('BUY NOW').click();
        });
    }
  
    // Function to validate the details of an eSIM package
    function validateEsimDetails(expectedDetails) {
      cy.get(elementSelectors.esimDetailPopup).should('be.visible').within(() => {
        // Verify the eSIM operator title
        cy.get(elementSelectors.esimDetailsFields.operatorTitle).should('have.text', expectedDetails.operatorName);
  
        // Verify each detail field dynamically
        Object.keys(expectedDetails.detailFields).forEach((fieldKey) => {
          const { fieldLabel, expectedValue } = expectedDetails.detailFields[fieldKey];
          cy.get(`[data-testid="${fieldLabel}-row"]`)
            .should('be.visible')
            .and('contain', fieldLabel)
            .next(`[data-testid="${fieldLabel}-value"]`)
            .should('be.visible')
            .invoke('text')
            .then((actualText) => {
              const normalizedText = actualText.trim();
              expect(normalizedText).to.eq(expectedValue);
            });
        });
      });
    }
  
    it('Visit homepage, search for an eSIM, and validate package details', () => {
      const { homePageSearchDetails, expectedEsimDetails } = testInputs;
  
      // Accept cookies
      acceptCookiesBanner();
  
      // Search for the desired country
      searchForCountry(homePageSearchDetails);
  
      // Select an eSIM item
      selectEsimItemWithBuyNow();
  
      // Validate the eSIM package details
      validateEsimDetails(expectedEsimDetails);
    });
  });
  