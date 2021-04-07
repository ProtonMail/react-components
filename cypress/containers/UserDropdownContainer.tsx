export const userDropdownElements = {
    buttonUserDropdown: () => cy.dataId('button-userdropdown'),
    buttonLogout: () => cy.dataId('button-logout'),
};

class UserDropdownContainer {
    logout() {
        userDropdownElements.buttonUserDropdown().click();
        userDropdownElements.buttonLogout().click();
        return this;
    }
}

export default UserDropdownContainer;
