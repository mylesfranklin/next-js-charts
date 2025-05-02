# Airtable Dashboard for Project Delivery System

This is a web-based dashboard for the Project Delivery System, built with Next.js, TypeScript, and Shadcn UI components. It provides a clean, modern interface to interact with Airtable data.

## Features

- **Authentication**: Simple login system to protect the dashboard
- **Project Delivery Schedule**: View and manage project delivery schedules
- **Order Pickup Schedule**: View and manage order pickup schedules
- **Responsive Design**: Works on desktop and tablet devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Filtering and Sorting**: Filter and sort data in tables
- **Detailed Views**: Click on rows to see detailed information

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/project-delivery-dashboard.git
   cd project-delivery-dashboard
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Airtable API credentials
   AIRTABLE_API_KEY=your-airtable-api-key
   AIRTABLE_BASE_ID=your-airtable-base-id
   AIRTABLE_PROJECT_DELIVERY_TABLE_ID=your-project-delivery-table-id
   AIRTABLE_ORDER_PICKUP_TABLE_ID=your-order-pickup-table-id
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Login Credentials

- Email: admin@example.com
- Password: password123

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import your repository.
3. Add the environment variables from your `.env.local` file.
4. Deploy the application.

## Project Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: React components
  - `dashboard/`: Dashboard-specific components
  - `project-delivery/`: Project delivery components
  - `order-pickup/`: Order pickup components
  - `ui/`: Shadcn UI components
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and API clients
- `public/`: Static assets

## Future Enhancements

- Dashboard analytics and visualization views
- Export functionality for reports
- User roles and permissions
- Notification system for status changes

## License

This project is licensed under the MIT License.
