/*
How to use it:
<c-custom-lookup obj-name="User" fields-name="Id, Name" where-clause-field="Name" icon-name="standard:user"
                filter="AND IsActive = true" onlookupselected={handleLookupSelected}>
</c-custom-lookup>

<c-custom-lookup obj-name="Opportunity" icon-name="standard:opportunity"
                fields-name="Name" where-clause-field="Name" onlookupselected={handleLookupSelected}>
</c-custom-lookup>

handleLookupSelected(e) {
    console.log('[handleOwnerSelected] e.detail', JSON.stringify(e.detail));
}
*/

import { LightningElement, wire, api, track } from 'lwc';
import lookUp from '@salesforce/apex/LWCCalendarController.search';

export default class CustomLookup extends LightningElement {
    @api objName = 'Opportunity';
    @api fieldsName = 'Id, Name';
    @api whereClauseField = 'Name';
    @api iconName = 'standard:opportunity';
    @api filter = '';
    @api alwaysShowLookup = false;

    selectedName;
    records;
    isValueSelected;
    blurTimeout;

    searchTerm;
    boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    inputClass = '';

    @wire(lookUp, {searchTerm : '$searchTerm', myObject : '$objName', fields: '$fieldsName', whereClauseField: '$whereClauseField', filter : '$filter'})
    wiredRecords({error, data}) {
        if (data) {
            this.error = undefined;
            this.records = data;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() => {
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'
        }, 200);
    }

    onSelect(event) {
        let selectedRecord = this.records.filter(record => record.Id === event.currentTarget.dataset.id)[0];
        console.log('[onSelect] selectedRecord', selectedRecord);

        let eventDetail = {
            selectedRecord: selectedRecord,
            objName: this.objName
        }
        console.log('[onSelect] eventDetail', eventDetail);

        this.fireEvent(eventDetail);

        this.isValueSelected = !this.alwaysShowLookup;
        this.selectedName = selectedRecord.Name;
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        console.log('[CustomLookup] [onSelect]', this.selectedName);
    }

    handleRemovePill() {
        let eventDetail = {
            objName: this.objName
        }
        this.fireEvent(eventDetail);
        this.isValueSelected = false;
    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }

    fireEvent(detail) {
        const valueSelectedEvent = new CustomEvent('lookupselected', {
            detail:  detail
        });
        this.dispatchEvent(valueSelectedEvent);
    }

}
