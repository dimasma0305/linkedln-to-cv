import React, { useState } from 'react';
import { LinkedInData } from '@/types/linkedin';
import { Document, Page, Text, View, StyleSheet, PDFViewer, pdf, Svg, Path } from '@react-pdf/renderer';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// Simplified styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 25,
    borderBottom: '2px solid #2563EB',
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nameSection: {
    maxWidth: '70%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  headline: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  contactSection: {
    alignItems: 'flex-end',
  },
  contactItem: {
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  contactIcon: {
    fontSize: 10,
    width: 12,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 10,
    color: '#4B5563',
  },
  mainContent: {
    flexDirection: 'row',
    gap: 20,
  },
  leftColumn: {
    width: '32%',
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 6,
  },
  rightColumn: {
    width: '64%',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    borderBottom: '2px solid #3B82F6',
    paddingBottom: 5,
    marginBottom: 12,
  },
  item: {
    marginBottom: 12,
    paddingLeft: 16,
    borderLeft: '3px solid #3B82F6',
    position: 'relative',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#111827',
    marginBottom: 2,
  },
  itemDates: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  itemDescription: {
    fontSize: 11,
    lineHeight: 1.4,
    color: '#1F2937',
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillItem: {
    fontSize: 11,
    backgroundColor: '#DBEAFE',
    padding: '4 8',
    borderRadius: 4,
    color: '#1E40AF',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: '1px solid #E5E7EB',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 9,
    color: '#4B5563',
  },
});

// Add icon styles
const iconStyles = StyleSheet.create({
  icon: {
    width: 10,
    height: 10,
  },
  iconContainer: {
    width: 12,
    height: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

// PDF Icons Component
const PDFIcon = ({ type }: { type: 'location' | 'phone' | 'linkedin' | 'facebook' | 'twitter' | 'whatsapp' | 'email' }) => {
  // SVG paths for common icons
  const iconPaths = {
    location: 'M8 0C4.132 0 1 3.132 1 7c0 1.475.5 2.838 1.338 3.924 1.726 2.228 4.185 4.99 5.282 6.262.13.15.372.15.5 0 1.1-1.274 3.559-4.036 5.285-6.264C14.5 9.838 15 8.475 15 7c0-3.868-3.133-7-7-7zm0 9.5C6.62 9.5 5.5 8.38 5.5 7S6.62 4.5 8 4.5 10.5 5.62 10.5 7 9.38 9.5 8 9.5z',
    phone: 'M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z',
    linkedin: 'M15 2.5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-11zM5 6h2v7H5V6zm.25-2A1.25 1.25 0 1 1 4 2.75 1.25 1.25 0 0 1 5.25 4H5.2zM12 9.5c0-1.81-1.5-2.5-2.5-2.5-.55 0-1.13.19-1.5.5V6H6v7h2v-4s1.5-.75 2 .5V13h2V9.5z',
    facebook: 'M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z',
    twitter: 'M9.089 0L7.303 1.7 4.97 1.001 3.92 2.602.998 1.8.019 3.8l2.582 1.7L.5 8.2l1.898 1.599L.5 12.2l1.898 1.599 2.683-3 2.694 1.899 1.898-1.998 2.553 1L14.5 8.4l-3.162-3.5L14.5.2l-5.411 1.2v-1.4zm.55 3.6l-1.798 1.499-2.183-1 1.298 2.597-1.898 1.5 2.776.699.55 1.797.639-1.997 3.002.8-2.783-1.699z',
    whatsapp: 'M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z',
    email: 'M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z'
  };

  return (
    <View style={iconStyles.iconContainer}>
      <Svg style={iconStyles.icon} viewBox="0 0 16 16">
        <Path d={iconPaths[type]} fill="#4B5563" />
      </Svg>
    </View>
  );
};

// Helper function to clean text
const cleanText = (text: string | undefined): string => {
  if (!text) return '';
  return text.replace(/"/g, '').replace(/\s+/g, ' ').trim();
};

// Helper function to format LinkedIn URL
const formatLinkedInUrl = (linkedin: string | undefined): string => {
  if (!linkedin) return '';
  
  // Clean the text first
  let clean = cleanText(linkedin);
  
  // If empty after cleaning, return empty string
  if (!clean) return '';
  
  console.log("Formatting LinkedIn URL:", clean);
  
  // If it's a full URL already, return it
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  
  // If it already contains linkedin.com/in/username format, keep it
  if (clean.includes('linkedin.com/in/')) {
    return clean;
  }
  
  // If it already contains linkedin.com but not /in/ part
  if (clean.includes('linkedin.com')) {
    return clean.replace('linkedin.com', 'linkedin.com/in');
  }
  
  // Remove any @ symbol if present
  clean = clean.replace('@', '');
  
  // If it's just a username (without linkedin.com part)
  // and doesn't include linkedin.com/in/ already
  return `linkedin.com/in/${clean}`;
};

// Helper function to format date
const formatDate = (date: string | undefined): string => {
  if (!date || date === 'Present') return 'Present';
  const [month, year] = date.split('-');
  if (!month || !year) return date;
  const fullYear = year.length === 2 ? '20' + year : year;
  return `${month} ${fullYear}`;
};

// Helper function to sort by date
const sortByDate = <T extends { startDate?: string; endDate?: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    const dateA = a.endDate || a.startDate || '';
    const dateB = b.endDate || b.startDate || '';
    return dateB.localeCompare(dateA);
  });
};

// Component to render a section item
const SectionItem = ({ title, subtitle, dates, description, location }: {
  title: string;
  subtitle?: string;
  dates: string;
  description?: string;
  location?: string;
}) => (
  <View style={styles.item}>
    <Text style={styles.itemTitle}>{cleanText(title)}</Text>
    {subtitle && <Text style={styles.itemSubtitle}>{cleanText(subtitle)}</Text>}
    <Text style={styles.itemDates}>
      {dates}
      {location && ` | ${cleanText(location)}`}
    </Text>
    {description && (
      <Text style={styles.itemDescription}>{cleanText(description)}</Text>
    )}
  </View>
);

// Component to render a section
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// New CVDocument component
const CVDocument: React.FC<{ data: LinkedInData }> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.nameSection}>
              <Text style={styles.name}>
                {cleanText(data.profile.firstName)} {cleanText(data.profile.lastName)}
              </Text>
              <Text style={styles.headline}>{cleanText(data.profile.headline)}</Text>
              {data.profile.location && (
                <Text style={styles.contactText}>{cleanText(data.profile.location)}</Text>
              )}
            </View>
            
            <View style={styles.contactSection}>
              {data.profile.address && (
                <View style={styles.contactItem}>
                  <PDFIcon type="location" />
                  <Text style={styles.contactText}>{cleanText(data.profile.address)}</Text>
                </View>
              )}
              {data.profile.email && (
                <View style={styles.contactItem}>
                  <PDFIcon type="email" />
                  <Text style={styles.contactText}>{cleanText(data.profile.email)}</Text>
                </View>
              )}
              {(data.profile.whatsapp || data.profile.phone) && (
                <View style={styles.contactItem}>
                  <PDFIcon type="whatsapp" />
                  <Text style={styles.contactText}>{cleanText(data.profile.whatsapp || data.profile.phone || '')}</Text>
                </View>
              )}
              {/* Always show LinkedIn if we have any data */}
              <View style={styles.contactItem}>
                {data.profile.linkedin && (
                  <>
                    <PDFIcon type="linkedin" />
                    <Text style={styles.contactText}>{formatLinkedInUrl(data.profile.linkedin)}</Text>
                  </>
                )}
              </View>
              {data.profile.facebook && (
                <View style={styles.contactItem}>
                  <PDFIcon type="facebook" />
                  <Text style={styles.contactText}>{cleanText(data.profile.facebook)}</Text>
                </View>
              )}
              {data.profile.twitterHandles && (
                <View style={styles.contactItem}>
                  <PDFIcon type="twitter" />
                  <Text style={styles.contactText}>{cleanText(data.profile.twitterHandles)}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.leftColumn}>
            {data.profile.summary && (
              <Section title="About Me">
                <Text style={styles.itemDescription}>{cleanText(data.profile.summary)}</Text>
              </Section>
            )}
            
            {data.skills.length > 0 && (
              <Section title="Skills">
                <View style={styles.skillsList}>
                  {data.skills.map((skill, index) => (
                    <Text key={index} style={styles.skillItem}>
                      {cleanText(skill)}
                    </Text>
                  ))}
                </View>
              </Section>
            )}

            {data.languages.length > 0 && (
              <Section title="Languages">
                {data.languages.map((lang, index) => (
                  <View key={index} style={styles.contactItem}>
                    <Text style={styles.itemTitle}>{cleanText(lang.name)}</Text>
                    <Text style={styles.itemSubtitle}>{cleanText(lang.proficiency)}</Text>
                  </View>
                ))}
              </Section>
            )}

            {data.certifications.length > 0 && (
              <Section title="Certifications">
                {sortByDate(data.certifications).map((cert, index) => (
                  <SectionItem
                    key={index}
                    title={cert.name}
                    subtitle={cert.authority}
                    dates={`${formatDate(cert.startDate)} - ${formatDate(cert.endDate)}`}
                  />
                ))}
              </Section>
            )}
          </View>

          <View style={styles.rightColumn}>
            {data.positions.length > 0 && (
              <Section title="Professional Experience">
                {sortByDate(data.positions).map((position, index) => (
                  <SectionItem
                    key={index}
                    title={position.title}
                    subtitle={position.companyName}
                    dates={`${formatDate(position.startDate)} - ${formatDate(position.endDate)}`}
                    description={position.description}
                    location={position.location}
                  />
                ))}
              </Section>
            )}

            {data.education.length > 0 && (
              <Section title="Education">
                {sortByDate(data.education).map((edu, index) => (
                  <SectionItem
                    key={index}
                    title={edu.school}
                    subtitle={`${edu.degreeName}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`}
                    dates={`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`}
                    description={edu.grade ? `Grade: ${edu.grade}` : undefined}
                  />
                ))}
              </Section>
            )}

            {data.volunteers.length > 0 && (
              <Section title="Volunteer Experience">
                {sortByDate(data.volunteers).map((volunteer, index) => (
                  <SectionItem
                    key={index}
                    title={volunteer.role}
                    subtitle={volunteer.organization}
                    dates={`${formatDate(volunteer.startDate)} - ${formatDate(volunteer.endDate)}`}
                    description={`${volunteer.cause ? `Cause: ${volunteer.cause}\n` : ''}${volunteer.description || ''}`}
                  />
                ))}
              </Section>
            )}

            {data.projects.length > 0 && (
              <Section title="Projects">
                {sortByDate(data.projects).map((project, index) => (
                  <SectionItem
                    key={index}
                    title={project.name}
                    dates={`${formatDate(project.startDate)} - ${formatDate(project.endDate)}`}
                    description={`${project.description || ''}\n${project.url || ''}`}
                  />
                ))}
              </Section>
            )}

            {data.honors.length > 0 && (
              <Section title="Honors & Awards">
                {sortByDate(data.honors.map(h => ({ ...h, endDate: h.issuedOn }))).map((honor, index) => (
                  <SectionItem
                    key={index}
                    title={honor.title}
                    dates={`Issued: ${formatDate(honor.issuedOn)}`}
                    description={honor.description}
                  />
                ))}
              </Section>
            )}
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text>CV generated from LinkedIn data • {new Date().getFullYear()} • {cleanText(data.profile.firstName)} {cleanText(data.profile.lastName)}</Text>
        </View>
      </Page>
    </Document>
  );
};

const CVPreview: React.FC<{ data: LinkedInData }> = ({ data }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Add debugging for data received by CVPreview
  console.log("CVPreview received data:", {
    hasData: Boolean(data),
    linkedIn: data?.profile?.linkedin,
    name: `${data?.profile?.firstName} ${data?.profile?.lastName}`
  });

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await pdf(<CVDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cleanText(data.profile.firstName)}_${cleanText(data.profile.lastName)}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Your CV Preview
          </h2>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isDownloading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <PDFViewer className="w-full h-[800px]">
            <CVDocument data={data} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export default CVPreview; 