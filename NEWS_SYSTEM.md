# News & Announcement System

The Attendance Portal includes a comprehensive news and announcement system that allows administrators to create, manage, and display company news, policies, events, and important announcements to all employees.

## Features

### 🗞️ News Categories
- **Announcements**: Important company-wide announcements and updates
- **News**: General company news and updates
- **Policies**: Company policy changes and updates
- **Events**: Upcoming events, workshops, and team activities

### 🚨 Priority Levels
- **Urgent**: Critical information requiring immediate attention
- **High**: Important updates that should be reviewed soon
- **Medium**: Standard priority news items
- **Low**: Informational updates

### 🔍 Advanced Features
- **Search Functionality**: Search across titles, content, and tags
- **Category Filtering**: Filter news by category
- **Priority Filtering**: Filter news by priority level
- **Tag System**: Organize news with searchable tags
- **Expiration Dates**: Set automatic expiration for time-sensitive news
- **Rich Content**: Support for formatted text with line breaks

## User Interface

### Public News Page (`/news`)
- **View All News**: Browse all published news and announcements
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-friendly grid layout
- **News Details**: Click to view full news content in modal

### Admin News Management (`/admin/news`)
- **Add News**: Create new news items with full form
- **Edit News**: Modify existing news items
- **Delete News**: Remove outdated or incorrect news
- **Bulk Management**: View all news in organized table format

## API Endpoints

### Public Endpoints
- `GET /api/news` - Get all published news with filtering
- `GET /api/news/latest` - Get latest news items
- `GET /api/news/:id` - Get specific news item
- `GET /api/news/categories` - Get available categories

### Admin Endpoints (Require Admin Authentication)
- `POST /api/news/add` - Create new news item
- `PUT /api/news/:id` - Update existing news item
- `DELETE /api/news/:id` - Delete news item

## Database Schema

```javascript
{
  title: String (required),
  content: String (required),
  summary: String (optional),
  category: String (announcement|news|policy|event),
  priority: String (low|medium|high|urgent),
  isPublished: Boolean (default: true),
  publishedAt: Date (default: now),
  expiresAt: Date (optional),
  attachments: Array (optional),
  createdBy: ObjectId (ref: User),
  tags: Array of Strings,
  timestamps: true
}
```

## Setup Instructions

### 1. Database Seeding
To populate the system with sample news data:

```bash
cd server
npm run seed:news
```

**Note**: Make sure you have at least one admin user in the database before running the seed script.

### 2. Environment Variables
Ensure your `.env` file includes:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Server Startup
```bash
cd server
npm install
npm run dev
```

### 4. Client Startup
```bash
cd client
npm install
npm start
```

## Usage Examples

### Creating a News Item
1. Navigate to Admin Dashboard → News Management
2. Click "Add News" button
3. Fill in the required fields:
   - **Title**: Clear, descriptive title
   - **Content**: Full news content (supports line breaks)
   - **Summary**: Brief summary for preview (optional)
   - **Category**: Select appropriate category
   - **Priority**: Set appropriate priority level
   - **Tags**: Comma-separated tags for organization
   - **Expires At**: Set expiration date if needed
4. Click "Add News" to publish

### Managing News Items
- **View**: Click the eye icon to preview full content
- **Edit**: Click the edit icon to modify existing news
- **Delete**: Click the trash icon to remove news (with confirmation)

### Filtering and Search
- **Search Bar**: Type keywords to search across all content
- **Category Filters**: Click category buttons to filter by type
- **Priority Filters**: Filter by urgency level
- **Combined Filters**: Use multiple filters simultaneously

## Best Practices

### Content Guidelines
- **Titles**: Keep clear and concise (5-50 characters)
- **Content**: Use line breaks for readability
- **Tags**: Use relevant, searchable tags
- **Priority**: Set appropriate priority levels

### Management Tips
- **Regular Updates**: Keep news current and relevant
- **Expiration Dates**: Use for time-sensitive announcements
- **Tag Organization**: Maintain consistent tagging system
- **Content Review**: Review and update outdated information

### User Experience
- **Clear Communication**: Use appropriate categories and priorities
- **Search Optimization**: Include relevant keywords in content
- **Mobile Friendly**: Content displays well on all devices
- **Accessibility**: Clear contrast and readable text

## Troubleshooting

### Common Issues

**News not displaying:**
- Check if news is published (`isPublished: true`)
- Verify expiration date hasn't passed
- Ensure user has proper permissions

**Admin access denied:**
- Verify user has admin role
- Check JWT token validity
- Ensure proper authentication middleware

**Database connection errors:**
- Verify MongoDB connection string
- Check network connectivity
- Ensure MongoDB service is running

### Performance Tips
- Use appropriate indexes on frequently queried fields
- Implement pagination for large news collections
- Cache frequently accessed news items
- Optimize image attachments if used

## Future Enhancements

Potential improvements for the news system:
- **Rich Text Editor**: WYSIWYG editor for content creation
- **Image Support**: Upload and display images in news
- **Email Notifications**: Send news updates via email
- **Newsletter Integration**: Export news for company newsletters
- **Analytics**: Track news readership and engagement
- **Scheduled Publishing**: Set future publication dates
- **News Templates**: Predefined templates for common news types

## Support

For technical support or questions about the news system:
- Check the server logs for error messages
- Verify database connectivity and permissions
- Ensure all required dependencies are installed
- Review the API documentation for endpoint details 