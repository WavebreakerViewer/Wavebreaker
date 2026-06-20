; First is default
LoadLanguageFile "${NSISDIR}\Contrib\Language files\English.nlf"

; Language selection dialog
LangString InstallerLanguageTitle  ${LANG_ENGLISH} "Installer Language"
LangString SelectInstallerLanguage  ${LANG_ENGLISH} "Please select the language of the installer"

; subtitle on license text caption
LangString LicenseSubTitleUpdate ${LANG_ENGLISH} " Update"
LangString LicenseSubTitleSetup ${LANG_ENGLISH} " Setup"

LangString MULTIUSER_TEXT_INSTALLMODE_TITLE ${LANG_ENGLISH} "Installation Mode"
LangString MULTIUSER_TEXT_INSTALLMODE_SUBTITLE ${LANG_ENGLISH} "Install for all users (requires Admin) or only for the current user?"
LangString MULTIUSER_INNERTEXT_INSTALLMODE_TOP ${LANG_ENGLISH} "When you run this installer with Admin privileges, you can choose whether to install in (e.g.) c:\Program Files or the current user's AppData\Local folder."
LangString MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS ${LANG_ENGLISH} "Install for all users"
LangString MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER ${LANG_ENGLISH} "Install for current user only"

; installation directory text
LangString DirectoryChooseTitle ${LANG_ENGLISH} "Installation Directory"
LangString DirectoryChooseUpdate ${LANG_ENGLISH} "Select the Wavebreaker directory to update to version ${VERSION_LONG}.(XXX):"
LangString DirectoryChooseSetup ${LANG_ENGLISH} "Select the directory to install Wavebreaker in:"

LangString MUI_TEXT_DIRECTORY_TITLE ${LANG_ENGLISH} "Installation Directory"
LangString MUI_TEXT_DIRECTORY_SUBTITLE ${LANG_ENGLISH} "Select the directory into which to install Wavebreaker:"

LangString MUI_TEXT_INSTALLING_TITLE ${LANG_ENGLISH} "Installing Wavebreaker..."
LangString MUI_TEXT_INSTALLING_SUBTITLE ${LANG_ENGLISH} "Installing the Wavebreaker viewer to $INSTDIR"

LangString MUI_TEXT_FINISH_TITLE ${LANG_ENGLISH} "Installing Wavebreaker"
LangString MUI_TEXT_FINISH_SUBTITLE ${LANG_ENGLISH} "Installed the Wavebreaker viewer to $INSTDIR."

LangString MUI_TEXT_ABORT_TITLE ${LANG_ENGLISH} "Installation Aborted"
LangString MUI_TEXT_ABORT_SUBTITLE ${LANG_ENGLISH} "Not installing the Wavebreaker viewer to $INSTDIR."

; CheckStartupParams message box
LangString CheckStartupParamsMB ${LANG_ENGLISH} "Could not find the program '$INSTNAME'. Silent update failed."

; installation success dialog
LangString InstSuccesssQuestion ${LANG_ENGLISH} "Start Wavebreaker now?"

; remove old NSIS version
LangString RemoveOldNSISVersion ${LANG_ENGLISH} "Checking for old version..."

; check windows version
LangString CheckWindowsVersionDP ${LANG_ENGLISH} "Checking Windows version..."
LangString CheckWindowsVersionMB ${LANG_ENGLISH} "Wavebreaker only supports Windows Vista with Service Pack 2 and later.$\nInstallation on this Operating System is not supported. Quitting."
LangString CheckWindowsServPackMB ${LANG_ENGLISH} "It is recomended to run Wavebreaker on the latest service pack for your operating system.$\nThis will help with performance and stability of the program."
LangString UseLatestServPackDP ${LANG_ENGLISH} "Please use Windows Update to install the latest Service Pack."

; checkifadministrator function (install)
LangString CheckAdministratorInstDP ${LANG_ENGLISH} "Checking for permission to install..."
LangString CheckAdministratorInstMB ${LANG_ENGLISH} 'You appear to be using a "limited" account.$\nYou must be an "administrator" to install Wavebreaker.'

; checkifadministrator function (uninstall)
LangString CheckAdministratorUnInstDP ${LANG_ENGLISH} "Checking for permission to uninstall..."
LangString CheckAdministratorUnInstMB ${LANG_ENGLISH} 'You appear to be using a "limited" account.$\nYou must be an "administrator" to uninstall Wavebreaker.'

; checkcpuflags
LangString MissingSSE2 ${LANG_ENGLISH} "This machine may not have a CPU with SSE2 support, which is required to run Wavebreaker ${VERSION_LONG}. Do you want to continue?"

; Extended cpu checks (AVX2)
LangString MissingAVX2 ${LANG_ENGLISH} "Your CPU does not support AVX2 instructions. Please download the legacy CPU version from %DLURL%-legacy-cpus/"
LangString AVX2Available ${LANG_ENGLISH} "Your CPU supports AVX2 instructions. You can download the AVX2 optimized version for better performance from %DLURL%/. Do you want to download it now?"
LangString AVX2OverrideConfirmation ${LANG_ENGLISH} "If you believe that your PC can support AVX2 optimization, you may install anyway. Do you want to proceed?"
LangString AVX2OverrideNote ${LANG_ENGLISH} "By overriding the installer, you are about to install a version that might crash immediately after launching. If this happens, please immediately install the standard CPU version."

; closesecondlife function (install)
LangString CloseSecondLifeInstDP ${LANG_ENGLISH} "Waiting for Wavebreaker to shut down..."
LangString CloseSecondLifeInstMB ${LANG_ENGLISH} "Wavebreaker can't be installed while it is already running.$\n$\nFinish what you're doing then select OK to close Wavebreaker and continue.$\nSelect CANCEL to cancel installation."
LangString CloseSecondLifeInstRM ${LANG_ENGLISH} "Wavebreaker failed to remove some files from a previous install."

; closesecondlife function (uninstall)
LangString CloseSecondLifeUnInstDP ${LANG_ENGLISH} "Waiting for Wavebreaker to shut down..."
LangString CloseSecondLifeUnInstMB ${LANG_ENGLISH} "Wavebreaker can't be uninstalled while it is already running.$\n$\nFinish what you're doing then select OK to close Wavebreaker and continue.$\nSelect CANCEL to cancel."

; CheckNetworkConnection
LangString CheckNetworkConnectionDP ${LANG_ENGLISH} "Checking network connection..."

; error during installation
LangString ErrorSecondLifeInstallRetry ${LANG_ENGLISH} "Wavebreaker installer encountered issues during installation. Some files may not have been copied correctly."
LangString ErrorSecondLifeInstallSupport ${LANG_ENGLISH} "Please reinstall viewer from https://www.wavebreakerviewer.org/downloads/ and contact https://www.wavebreakerviewer.org/support/ if issue persists after reinstall."

; ask to remove user's data files
LangString RemoveDataFilesMB ${LANG_ENGLISH} "Delete settings and cache files in Documents and Settings folder?"

; delete program files
LangString DeleteProgramFilesMB ${LANG_ENGLISH} "There are still files in your Wavebreaker program directory.$\n$\nThese are possibly files you created or moved to:$\n$INSTDIR$\n$\nDo you want to remove them?"

; uninstall text
LangString UninstallTextMsg ${LANG_ENGLISH} "This will uninstall Wavebreaker ${VERSION_LONG} from your system."

; ask to remove protocol handler registry entries registry keys that still might be needed by other viewers that are installed
LangString DeleteRegistryKeysMB ${LANG_ENGLISH} "Do you want to remove Wavebreaker as default handler for virtual world protocols?$\n$\nIt is recomended to keep registry keys if you have other versions of Wavebreaker installed."

; <FS:Ansariel> Ask to create protocol handler registry entries
LangString CreateUrlRegistryEntries ${LANG_ENGLISH} "Do you want to register Wavebreaker as default handler for virtual world protocols?$\n$\nIf you have other versions of Wavebreaker installed, this will overwrite the existing registry keys."

; <FS:Ansariel> Optional start menu entry
LangString CreateStartMenuEntry ${LANG_ENGLISH} "Create an entry in the start menu?"

; <FS:Ansariel> Application name suffix for OpenSim variant
LangString ForOpenSimSuffix ${LANG_ENGLISH} "for OpenSimulator"

LangString DeleteDocumentAndSettingsDP ${LANG_ENGLISH} "Deleting files in Documents and Settings folder."
LangString UnChatlogsNoticeMB ${LANG_ENGLISH} "This uninstall will NOT delete your Wavebreaker chat logs and other private files. If you want to do that yourself, delete the Wavebreaker folder within your user Application data folder."
LangString UnRemovePasswordsDP ${LANG_ENGLISH} "Removing Wavebreaker saved passwords."

LangString MUI_TEXT_LICENSE_TITLE ${LANG_ENGLISH} "Vivox Voice System License Agreement"
LangString MUI_TEXT_LICENSE_SUBTITLE ${LANG_ENGLISH} "Additional license agreement for the Vivox Voice System components."
LangString MUI_INNERTEXT_LICENSE_TOP ${LANG_ENGLISH} "Please read the following license agreement carefully before proceeding with the installation:"
LangString MUI_INNERTEXT_LICENSE_BOTTOM ${LANG_ENGLISH} "You have to agree to the license terms to continue with the installation."
