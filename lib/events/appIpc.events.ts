export enum AppIpcEvents {
    // Event to get the current version of the application
    GET_VERSION = 'getVersion',
    
    // Event to open a URL in the default browser
    OPEN_URL = 'openUrl',
    
    // Event to show an error message dialog
    SHOW_ERROR_DIALOG = 'showErrorDialog',
    
    // Event to show a confirmation dialog
    SHOW_CONFIRMATION_DIALOG = 'showConfirmationDialog',
    
    // Event to show an information dialog
    SHOW_INFORMATION_DIALOG = 'showInformationDialog',
    
    // Event to show a warning dialog
    SHOW_WARNING_DIALOG = 'showWarningDialog',
}