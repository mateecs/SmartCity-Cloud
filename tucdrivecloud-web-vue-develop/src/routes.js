const DashView = () => import('./components/Dash.vue')
const LoginView = () => import('./components/Login.vue')
const NotFoundView = () => import('./components/404.vue')

const EmptyRouterView = () => import('./components/views/EmptyRouterView.vue')
const DashboardView = () => import('./components/views/Dashboard.vue')
const VehiclesView = () => import('./components/views/Vehicles.vue')
const VehicleConfiguration = () => import('./components/views/VehicleConfiguration.vue')
const SensorsView = () => import('./components/views/Sensors.vue')
const SensorConfiguration = () => import('./components/views/SensorConfiguration.vue')
const SettingsView = () => import('./components/views/DriveSetups.vue')
const SettingsConfiguration = () => import('./components/views/DriveSetupConfiguration.vue')
const TestDrivesView = () => import('./components/views/TestDrives.vue')
const TestDriveDetailsView = () => import('./components/views/TestDriveDetails.vue')
const ExportTestDrivesView = () => import('./components/views/ExportTestDrives.vue')
const ExportDriveSensorsView = () => import('./components/views/ExportDriveSensors.vue')
const ImportTestDrivesView = () => import('./components/views/ImportTestDrives.vue')
const VehicleTokenView = () => import('./components/views/VehicleTokenList.vue')
const TokenConfiguration = () => import('./components/views/TokenConfiguration.vue')
const Imprint = () => import('./components/views/Imprint.vue')
const PrivacyStatement = () => import('./components/views/PrivacyStatement.vue')

// Routes
const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    component: DashView,
    children: [
      {
        path: 'dashboard',
        alias: '',
        component: DashboardView,
        name: 'Dashboard',
        meta: { description: 'TUC SmartCityCloud Overview', requiresAuth: true }
      }, {
        path: 'sensors',
        component: EmptyRouterView,
        children: [
          {
            path: '',
            name: 'Sensors',
            meta: { description: 'Management of available sensors', requiresAuth: true },
            component: SensorsView
          },
          {
            path: ':id/config',
            alias: '',
            component: SensorConfiguration,
            name: 'Sensor configuration',
            meta: { description: 'Show details and configure a sensor', requiresAuth: true }
          }
        ]
      }, {
        path: 'vehicles',
        name: 'Vehicles',
        component: EmptyRouterView,
        children: [
          {
            path: '',
            name: '',
            meta: { description: 'Management of registered vehicles', requiresAuth: true },
            component: VehiclesView
          },
          {
            path: ':id/config',
            alias: '',
            component: VehicleConfiguration,
            name: 'Vehicle configuration',
            meta: { description: 'Show details and configure a vehicle', requiresAuth: true }
          }
        ]
      },
      {
        path: 'setting',
        name: 'Setting',
        component: EmptyRouterView,
        children: [
          {
            path: '',
            name: '',
            meta: { description: 'Management of Drive Setups', requiresAuth: true },
            component: SettingsView
          },
          {
            path: ':id/config',
            alias: '',
            component: SettingsConfiguration,
            name: 'Drive Setup configuration',
            meta: { description: 'Show details and configure a Drive Setup', requiresAuth: true }
          }
        ]
      },
      {
        path: 'drives',
        component: EmptyRouterView,
        name: 'Test drives',
        children: [
          {
            path: '',
            name: '',
            meta: { description: 'Recorded test drives', requiresAuth: true },
            component: TestDrivesView
          },
          {
            path: ':id',
            alias: '',
            component: TestDriveDetailsView,
            name: 'Test drive details',
            meta: { description: 'Display and analyse test drive data', requiresAuth: true }
          }
        ]
      },
      {
        path: 'export',
        name: 'Data Export',
        component: EmptyRouterView,
        children: [
          {
            path: '',
            name: '',
            meta: { description: 'Recorded test drives to download', requiresAuth: true },
            component: ExportTestDrivesView
          },
          {
            path: ':id',
            alias: '',
            component: ExportDriveSensorsView,
            name: 'Test drive Sensors',
            meta: { description: 'Choose Sensors for downloading Data', requiresAuth: true }
          }
        ]
      },
      {
        path: 'import',
        name: 'Data Import',
        component: EmptyRouterView,
        children: [
          {
            path: '',
            name: '',
            meta: { description: 'Upload test drives', requiresAuth: true },
            component: ImportTestDrivesView
          }
        ]
      },
      {
        path: 'tokens',
        name: 'Tokens',
        component: EmptyRouterView,
        children: [
          {
            path: '',
            name: '',
            meta: { description: 'Management of tokens for registered vehicles', requiresAuth: true },
            component: VehicleTokenView
          },
          {
            path: ':id/config',
            alias: '',
            component: TokenConfiguration,
            name: 'Token configuration',
            meta: { description: 'Show (and edit) expiration date of tokens or delete tokens', requiresAuth: true }
          }
        ]
      },
      {
        path: 'imprint',
        name: 'Imprint',
        component: Imprint,
        meta: { description: 'View imprint and data privacy statement', requiresAuth: false }
      },
      {
        path: 'privacystatement',
        name: 'Data Privacy Statement',
        component: PrivacyStatement,
        meta: { description: 'View the data privacy statement', requiresAuth: false }
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
