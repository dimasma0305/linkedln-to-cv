'use client';

import { useState, useRef, DragEvent } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import JSZip from 'jszip';
import Papa, { ParseResult } from 'papaparse';
import CVPreview from '@/components/CVPreview';
import { LinkedInData } from '@/types/linkedin';

// Helper function to parse file content
const parseFile = async (file: JSZip.JSZipObject): Promise<Record<string, string>[]> => {
  const content = await file.async('text');
  if (file.name.endsWith('.json')) {
    return JSON.parse(content);
  }
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Record<string, string>>) => resolve(results.data),
      error: (error: Error) => {
        console.error('Error parsing CSV:', error);
        resolve([]);
      }
    });
  });
};

// Helper function to find and process data from a specific file
const processDataFromFile = <T,>(data: Record<string, string>[], mapper: (item: Record<string, string>) => T): T[] => {
  return data
    .filter(item => Object.values(item).some(value => value && value.trim() !== ''))
    .map(mapper);
};

// Create base CV data template
const createBaseCVData = (): LinkedInData => {
  return {
    profile: {
      firstName: 'Your',
      lastName: 'Name',
      headline: 'Your Professional Headline',
      summary: '',
      location: '',
      industry: '',
      linkedin: '',
      address: '',
      facebook: '',
      phone: '',
      twitterHandles: '',
      email: '',
      whatsapp: ''
    },
    positions: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    honors: [],
    volunteers: [],
    projects: []
  };
};

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvData, setCvData] = useState<LinkedInData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate the final CV data
  const finalCvData = cvData;

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setError('Please upload a ZIP file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const profileData = createBaseCVData();

      // Process each file in the ZIP
      for (const [filename, file] of Object.entries(contents.files)) {
        if (file.dir) continue;

        try {
          const data = await parseFile(file);
          if (!data.length) continue;

          switch (filename) {
            case 'Profile.csv':
              const profile = data[0];
              if (profile['First Name']?.trim()) {
                profileData.profile = {
                  ...profileData.profile,
                  firstName: profile['First Name'],
                  lastName: profile['Last Name'] || '',
                  headline: profile['Headline'] || '',
                  summary: profile['Summary'] || '',
                  location: [profile['Address'], profile['Geo Location'], profile['Zip Code']].filter(Boolean).join(', '),
                  industry: profile['Industry'] || '',
                  address: profile['Address'],
                  linkedin: profile['LinkedIn'] || profile['LinkedIn Profile'] || profile['LinkedIn URL'],
                  facebook: profile['Facebook'] || profile['Facebook Profile'] || profile['Facebook URL'],
                  phone: profile['Phone Number'] || profile['Phone'] || profile['Mobile Phone'] || '',
                  twitterHandles: profile['Twitter'] || profile['Twitter Handle'] || profile['Twitter URL'] || ''
                };
              }
              break;

            case 'PhoneNumbers.csv':
            case 'Phone Numbers.csv':
            case 'Whatsapp Phone Numbers.csv':
              const phoneData = data.find(row => row['Number'] || row['Phone Number'] || row['Value']);
              if (phoneData) {
                const phoneNumber = phoneData['Number'] || phoneData['Phone Number'] || phoneData['Value'] || '';
                profileData.profile.whatsapp = phoneNumber;
                profileData.profile.phone = phoneNumber;
                console.log('Found phone number:', phoneNumber);
              }
              break;

            case 'Email Addresses.csv':
            case 'EmailAddresses.csv':
              const emailData = data.find(row => row['Email Address'] || row['Address'] || row['Value']);
              if (emailData) {
                const emailAddress = emailData['Email Address'] || emailData['Address'] || emailData['Value'] || '';
                profileData.profile.email = emailAddress;
                console.log('Found email address:', emailAddress);
              }
              break;

            case 'Positions.csv':
              profileData.positions = processDataFromFile(data, position => ({
                companyName: position['Company Name'] || '',
                title: position['Title'] || '',
                location: position['Location'] || 'Indonesia',
                startDate: position['Started On'] || '',
                endDate: position['Finished On'] || 'Present',
                description: position['Description'] || '',
                employmentType: position['Employment Type'] || ''
              }));
              break;

            case 'Education.csv':
              profileData.education = processDataFromFile(data, edu => ({
                school: edu['School Name'] || '',
                degreeName: edu['Degree Name'] || '',
                fieldOfStudy: edu['Field of Study'] || '',
                startDate: edu['Start Date'] || '',
                endDate: edu['End Date'] || '',
                grade: edu['Grade'] || '',
                activities: edu['Activities'] || '',
                notes: edu['Notes'] || '',
                description: edu['Description'] || ''
              }));
              break;

            case 'Skills.csv':
              profileData.skills = data.map(skill => skill['Name']).filter(Boolean);
              break;

            case 'Certifications.csv':
              profileData.certifications = processDataFromFile(data, cert => ({
                name: cert['Name'] || '',
                authority: cert['Authority'] || '',
                licenseNumber: cert['License Number'] || '',
                startDate: cert['Started On'] || '',
                endDate: cert['Finished On'] || '',
                url: cert['Url'] || ''
              }));
              break;

            case 'Languages.csv':
              profileData.languages = processDataFromFile(data, lang => ({
                name: lang['Name'] || '',
                proficiency: lang['Proficiency'] || ''
              }));
              break;

            case 'Honors.csv':
              profileData.honors = processDataFromFile(data, honor => ({
                title: honor['Title'] || '',
                description: honor['Description'] || '',
                issuedOn: honor['Issued On'] || ''
              }));
              break;

            case 'Volunteer Experiences.csv':
              profileData.volunteers = processDataFromFile(data, vol => ({
                organization: vol['Organization Name'] || '',
                role: vol['Role'] || '',
                cause: vol['Cause'] || '',
                description: vol['Description'] || '',
                startDate: vol['Started On'] || '',
                endDate: vol['Finished On'] || 'Present'
              }));
              break;

            case 'Projects.csv':
              profileData.projects = processDataFromFile(data, proj => ({
                name: proj['Title'] || '',
                description: proj['Description'] || '',
                url: proj['URL'] || '',
                startDate: proj['Started On'] || '',
                endDate: proj['Finished On'] || 'Present'
              }));
              break;
          }
        } catch (err) {
          console.warn(`Error processing ${filename}:`, err);
        }
      }

      setCvData(profileData);
      setShowPreview(true);
    } catch (err) {
      setError('Error processing file: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          LinkedIn to CV Converter
        </h1>

        {!showPreview ? (
          <div className="max-w-2xl mx-auto">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".zip"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
              
              <div>
                <ArrowUpTrayIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  Drop your LinkedIn data export here
                </h2>
                <p className="mb-4 text-gray-600">
                  or click to select a ZIP file
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Select File
                </button>
              </div>

              {isProcessing && (
                <div className="mt-4">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-pulse" />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Processing...</p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
                <h2 className="text-lg font-semibold mb-4 text-blue-700">CV Preview</h2>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Back to Upload
                  </button>
                </div>
              </div>
            </div>
            {finalCvData && <CVPreview data={finalCvData} />}
          </>
        )}
      </div>
    </div>
  );
} 