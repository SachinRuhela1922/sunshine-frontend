// Admin forms are generated from this schema.
// To add a field: add it here (admin) and use it in the page component (website).
const IMG = 'image', VID = 'video', TA = 'textarea';
const titleDesc = [{ k: 'title', l: 'Title' }, { k: 'desc', l: 'Description', t: TA }, { k: 'image', l: 'Image', t: IMG }];
const MEDALS = [['gold', 'Gold'], ['silver', 'Silver'], ['bronze', 'Bronze'], ['star', 'Star / Certificate']];
const CATS = [['Academics', 'Academics'], ['Sports', 'Sports'], ['Arts', 'Arts'], ['Science', 'Science']];
const ROLES = [['Director', 'Director'], ['Principal', 'Principal'], ['Vice Principal', 'Vice Principal']];
const dateItem = [{ k: 'title', l: 'Title' }, { k: 'date', l: 'Date' }, { k: 'desc', l: 'Description', t: TA }, { k: 'image', l: 'Image', t: IMG }];

export const SCHEMA = [
  { key: 'general', title: 'General Info', fields: [
    { k: 'schoolName', l: 'School Name' }, { k: 'tagline', l: 'Tagline' }, { k: 'logo', l: 'Logo', t: IMG },
    { k: 'established', l: 'Established date (founding date)', t: 'date', h: 'Default: 04 July 2003. The website shows it in the Leadership section and footer, and "Years of Excellence" is calculated from it automatically.' },
    { k: 'phone', l: 'Phone' }, { k: 'email', l: 'Email' }, { k: 'address', l: 'Address', t: TA },
    { k: 'mapEmbed', l: 'Google Map Embed URL (iframe src)' },
    { k: 'facebook', l: 'Facebook URL' }, { k: 'instagram', l: 'Instagram URL' }, { k: 'youtube', l: 'YouTube URL' }] },
  { key: 'hero', title: 'Home - Hero Section', fields: [
    { k: 'title', l: 'Title' }, { k: 'subtitle', l: 'Subtitle', t: TA }, { k: 'ctaText', l: 'Button Text' },
    { k: 'video', l: 'Background Video', t: VID }, { k: 'poster', l: 'Video Poster Image', t: IMG }] },
  { key: 'about', title: 'About Page', fields: [
    { k: 'title', l: 'Title' }, { k: 'text', l: 'Text', t: TA }, { k: 'image', l: 'Image', t: IMG },
    { k: 'mission', l: 'Mission', t: TA }, { k: 'vision', l: 'Vision', t: TA }] },
  { key: 'pages', title: 'Page Banners (all pages)', multi: [
    ['about', 'About'], ['programs', 'Programs'], ['facilities', 'Facilities'], ['teachers', 'Teachers'],
    ['gallery', 'Gallery'], ['news', 'News'], ['events', 'Events'], ['social', 'Social'], ['contact', 'Contact']],
    fields: [{ k: 'title', l: 'Title' }, { k: 'subtitle', l: 'Subtitle' }, { k: 'banner', l: 'Banner Image', t: IMG }] },
  { key: 'stats', title: 'Stats', list: true, name: 'Stat', fields: [{ k: 'value', l: 'Value (e.g. 1500+)', h: 'For the "Years of Excellence" stat the value is calculated automatically from the Established date, so you do not need to change it every year.' }, { k: 'label', l: 'Label' }] },
  { key: 'programs', title: 'Programs', list: true, name: 'Program', fields: titleDesc },
  { key: 'facilities', title: 'Facilities', list: true, name: 'Facility', fields: titleDesc },
  { key: 'teachers', title: 'Teachers', list: true, name: 'Teacher', fields: [{ k: 'name', l: 'Name' }, { k: 'role', l: 'Role / Subject' }, { k: 'image', l: 'Photo', t: IMG }] },
  { key: 'gallery', title: 'Gallery', list: true, name: 'Photo', bulk: 'image', fields: [{ k: 'image', l: 'Image', t: IMG }, { k: 'caption', l: 'Caption' }] },
  { key: 'news', title: 'News', list: true, name: 'News', fields: dateItem },
  { key: 'events', title: 'Events', list: true, name: 'Event', fields: dateItem },
  { key: 'testimonials', title: 'Testimonials', list: true, name: 'Testimonial', fields: [{ k: 'name', l: 'Name' }, { k: 'role', l: 'Role' }, { k: 'text', l: 'Text', t: TA }] },

  // ---------- Home page texts ----------
  { key: 'home', title: 'Home - Section Texts', fields: [
    { k: 'admissionText', l: 'Hero badge text', h: 'Small badge on the home banner, e.g. "Admissions open for 2026-27"' },
    { k: 'whySubtitle', l: '"Why Sunshine" subtitle', t: TA },
    { k: 'differentSubtitle', l: '"What Makes Us Different" subtitle', t: TA },
    { k: 'campusSubtitle', l: '"Campus Experience" subtitle', t: TA },
    { k: 'achieversSubtitle', l: '"Little Achievers" subtitle', t: TA },
    { k: 'visitSubtitle', l: '"Visit Our School" subtitle', t: TA },
    { k: 'visitHoursText', l: 'Visiting hours line', h: 'e.g. "Monday to Saturday, 9:00 AM to 1:00 PM"' }] },
  { key: 'whyFeatures', title: 'Home - Why Sunshine (4 cards)', list: true, name: 'Card', fields: [{ k: 'title', l: 'Title' }, { k: 'text', l: 'Text', t: TA }] },

  // ---------- Leadership ----------
  { key: 'leadershipInfo', title: 'Leadership - Section Heading', fields: [
    { k: 'title', l: 'Section title', h: 'The last word is shown in the orange accent colour, e.g. \"Our Leadership\".' },
    { k: 'subtitle', l: 'Section subtitle', t: TA }] },
  { key: 'leadership', title: 'Leadership - Director, Principal, Vice Principal', list: true, name: 'Leader', fields: [
    { k: 'role', l: 'Role', t: 'select', o: ROLES }, { k: 'name', l: 'Full name (e.g. Mrs. Anita Sharma)' }, { k: 'image', l: 'Photo', t: IMG },
    { k: 'qualification', l: 'Qualification' }, { k: 'experience', l: 'Experience (e.g. 25 years of teaching)' }, { k: 'joined', l: 'Position since (e.g. Principal since 2008)' },
    { k: 'quote', l: 'Short quote (shown on the card)', t: TA },
    { k: 'message', l: 'Message / about (new line = new paragraph)', t: TA },
    { k: 'achievements', l: 'What they have done (one per line)', t: TA, h: 'Write one achievement per line. Optional format: Title | short detail. Example: Started scholarship programme | Merit and need based scholarships for deserving students.' },
    { k: 'f1v', l: 'Fact 1 - number (e.g. 25)' }, { k: 'f1l', l: 'Fact 1 - label' },
    { k: 'f2v', l: 'Fact 2 - number' }, { k: 'f2l', l: 'Fact 2 - label' },
    { k: 'f3v', l: 'Fact 3 - number' }, { k: 'f3l', l: 'Fact 3 - label' }] },

  // ---------- Campus ----------
  { key: 'campusFacts', title: 'Campus - Quick Facts', list: true, name: 'Fact', fields: [{ k: 'value', l: 'Value (e.g. 5 acres)' }, { k: 'label', l: 'Label' }] },
  { key: 'campusDay', title: 'Campus - A Day on Campus', list: true, name: 'Time slot', fields: [{ k: 'time', l: 'Time (e.g. 9:00 AM)' }, { k: 'title', l: 'Title' }, { k: 'text', l: 'Text', t: TA }] },

  // ---------- Little Achievers ----------
  { key: 'tally', title: 'Achievers - Medal Tally', list: true, name: 'Counter', fields: [
    { k: 'medal', l: 'Medal icon', t: 'select', o: MEDALS }, { k: 'value', l: 'Number (e.g. 42 or 120+)' }, { k: 'label', l: 'Label' }] },
  { key: 'spotlight', title: 'Achievers - Achiever of the Year', fields: [
    { k: 'name', l: 'Student name' }, { k: 'cls', l: 'Class (e.g. Class 7)' }, { k: 'image', l: 'Student photo', t: IMG },
    { k: 'headline', l: 'Headline' }, { k: 'text', l: 'Story', t: TA },
    { k: 'f1v', l: 'Fact 1 - value' }, { k: 'f1l', l: 'Fact 1 - label' },
    { k: 'f2v', l: 'Fact 2 - value' }, { k: 'f2l', l: 'Fact 2 - label' },
    { k: 'f3v', l: 'Fact 3 - value' }, { k: 'f3l', l: 'Fact 3 - label' }] },
  { key: 'achievers', title: 'Achievers - Student Achievements', list: true, name: 'Student', fields: [
    { k: 'name', l: 'Student name' }, { k: 'cls', l: 'Class (e.g. Class 5)' }, { k: 'image', l: 'Student photo', t: IMG },
    { k: 'title', l: 'Achievement' }, { k: 'level', l: 'Level (School / District / State / National)' },
    { k: 'cat', l: 'Category', t: 'select', o: CATS }, { k: 'year', l: 'Year' }, { k: 'medal', l: 'Medal', t: 'select', o: MEDALS }] },
  { key: 'recognitions', title: 'Achievers - Special Recognitions', list: true, name: 'Award', fields: [
    { k: 'title', l: 'Award name' }, { k: 'text', l: 'Description', t: TA }, { k: 'recent', l: 'Recent winner' }] },

  // ---------- Visit ----------
  { key: 'visitHours', title: 'Visit - Weekly Timings', list: true, name: 'Day', fixed: true, fields: [
    { k: 'day', l: 'Day' }, { k: 'note', l: 'Timing text (e.g. 9:00 AM to 1:00 PM or Closed)' },
    { k: 'open', l: 'Opens at (24h hour, e.g. 9)', h: 'Leave Opens/Closes empty for a closed day. Keep all 7 days, Sunday first.' }, { k: 'close', l: 'Closes at (24h hour, e.g. 13)' }] },
  { key: 'visitReach', title: 'Visit - How to Reach', list: true, name: 'Route', fields: [{ k: 'title', l: 'Title (e.g. By road)' }, { k: 'text', l: 'Text', t: TA }, { k: 'meta', l: 'Small note' }] },
  { key: 'visitSteps', title: 'Visit - Visit Steps', list: true, name: 'Step', fields: [{ k: 'title', l: 'Title' }, { k: 'text', l: 'Text', t: TA }] },
  { key: 'visitBring', title: 'Visit - What to Bring', list: true, name: 'Item', fields: [{ k: 'item', l: 'Item' }] },
  { key: 'visitFaqs', title: 'Visit - FAQs', list: true, name: 'FAQ', fields: [{ k: 'q', l: 'Question' }, { k: 'a', l: 'Answer', t: TA }] }
];
