const requestNewCodeModal = () => {
    return {
        elements() {
            return {
                buttonRequestNewCode: () => cy.dataId('button-request-new-code'),
                buttonEditVerificationAddress: (verificationType: string) =>
                    cy.dataId(`button-edit-${verificationType}`),
                buttonCancel: () => cy.dataId('button-cancel'),
            };
        },

        requestNewCode(page?: any) {
            this.elements().buttonRequestNewCode().click();
            return page;
        },

        cancel(page?: any) {
            this.elements().buttonCancel().click();
            return page;
        },

        editVerificationAddress(verificationType: string, page?: any) {
            this.elements().buttonEditVerificationAddress(verificationType).click();
            return page;
        },
    };
};

export const requestNewCode = requestNewCodeModal();
