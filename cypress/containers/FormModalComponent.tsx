const formModalContainer = () =>  {
    return {

        elements() {
            return {
                buttonSubmit: (text: string = 'Submit') => cy.dataId('button-form-submit').contains(text),
                buttonReset: (text: string = 'Close') => cy.dataId('button-form-reset').contains(text),
            }
        },

        modalSubmit(withText: string, page?: any) {
            this.elements().buttonSubmit(withText).click();
            return page;
        },
    
        modalReset(withText: string, page?: any) {
            this.elements().buttonReset(withText).click();
            return page
        }
    }
}

export const formModal = formModalContainer();
