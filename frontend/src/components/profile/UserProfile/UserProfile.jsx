// import { useState, useEffect } from 'react'
// import { useAuth } from '../../../hooks/useAuth'
// import { useLanguage } from '../../../hooks/useLanguage'
// import Loader from '../../common/Loader/Loader'
// import api from '../../../services/api'
// import './UserProfile.css'

// const UserProfile = () => {
//   const { user, updateProfile, changePassword } = useAuth()
//   const { t } = useLanguage()
  
//   const [activeTab, setActiveTab] = useState('profile')
//   const [isLoading, setIsLoading] = useState(false)
//   const [message, setMessage] = useState({ type: '', text: '' })
//   const [uploadingAvatar, setUploadingAvatar] = useState(false)
  
//   const [profileData, setProfileData] = useState({
//     fullName: user?.fullName || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     profession: user?.profession || '',
//     bio: user?.bio || '',
//     avatar: user?.avatar || null,
//     location: user?.location || '',
//     website: user?.website || ''
//   })

//   const [securityData, setSecurityData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   })

//   const [preferences, setPreferences] = useState({
//     language: user?.preferences?.language || 'en',
//     emailNotifications: user?.preferences?.emailNotifications || true,
//     darkMode: user?.preferences?.darkMode || false,
//     fontSize: user?.preferences?.fontSize || 'medium'
//   })

//   const [errors, setErrors] = useState({})

//   useEffect(() => {
//     if (message.text) {
//       const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [message])

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target
//     setProfileData(prev => ({ ...prev, [name]: value }))
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }))
//     }
//   }

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     // Validate file size (max 2MB)
//     if (file.size > 2 * 1024 * 1024) {
//       setMessage({ type: 'error', text: 'Image size should be less than 2MB' })
//       return
//     }

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       setMessage({ type: 'error', text: 'Please upload an image file' })
//       return
//     }

//     const formData = new FormData()
//     formData.append('avatar', file)

//     setUploadingAvatar(true)
//     try {
//       const response = await api.post('/auth/upload-avatar', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
      
//       setProfileData(prev => ({ ...prev, avatar: response.data.avatar }))
//       // Update user context with new avatar
//       if (user) {
//         user.avatar = response.data.avatar
//       }
//       setMessage({ type: 'success', text: 'Avatar updated successfully!' })
//     } catch (error) {
//       console.error('Avatar upload error:', error)
//       setMessage({ type: 'error', text: 'Failed to upload avatar' })
//     } finally {
//       setUploadingAvatar(false)
//     }
//   }

//   const validateProfile = () => {
//     const newErrors = {}
//     if (!profileData.fullName) {
//       newErrors.fullName = 'Full name is required'
//     }
//     if (!profileData.email) {
//       newErrors.email = 'Email is required'
//     } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
//       newErrors.email = 'Email is invalid'
//     }
//     if (profileData.website && !/^https?:\/\/.+/.test(profileData.website)) {
//       newErrors.website = 'Please enter a valid URL (starting with http:// or https://)'
//     }
//     return newErrors
//   }

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault()
//     const newErrors = validateProfile()
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       return
//     }

//     setIsLoading(true)
//     try {
//       await updateProfile(profileData)
//       setMessage({ type: 'success', text: 'Profile updated successfully!' })
//     } catch (error) {
//       console.error('Profile update error:', error)
//       setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const validatePassword = () => {
//     const newErrors = {}
//     if (!securityData.currentPassword) {
//       newErrors.currentPassword = 'Current password is required'
//     }
//     if (!securityData.newPassword) {
//       newErrors.newPassword = 'New password is required'
//     } else if (securityData.newPassword.length < 8) {
//       newErrors.newPassword = 'Password must be at least 8 characters'
//     }
//     if (securityData.newPassword !== securityData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match'
//     }
//     return newErrors
//   }

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault()
//     const newErrors = validatePassword()
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       return
//     }

//     setIsLoading(true)
//     try {
//       await changePassword(securityData)
//       setMessage({ type: 'success', text: 'Password changed successfully!' })
//       setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
//     } catch (error) {
//       console.error('Password change error:', error)
//       setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handlePreferenceChange = (name, value) => {
//     setPreferences(prev => ({ ...prev, [name]: value }))
//   }

//   const handlePreferencesSubmit = async () => {
//     setIsLoading(true)
//     try {
//       await updateProfile({ preferences })
//       setMessage({ type: 'success', text: 'Preferences updated successfully!' })
//     } catch (error) {
//       console.error('Preferences update error:', error)
//       setMessage({ type: 'error', text: 'Failed to update preferences' })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getStats = () => {
//     return [
//       { label: t('bookmarks') || 'Bookmarks', value: user?.stats?.bookmarks || 0, icon: '🔖' },
//       { label: t('searches') || 'Searches', value: user?.stats?.searches || 0, icon: '🔍' },
//       { label: t('chatSessions') || 'Chat Sessions', value: user?.stats?.chatSessions || 0, icon: '💬' },
//       { label: t('memberSince') || 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', icon: '📅' }
//     ]
//   }

//   if (!user) {
//     return (
//       <div className="profile-container">
//         <div className="profile-error">
//           <div className="error-icon">⚠️</div>
//           <h3>{t('loginToViewProfile') || 'Please log in to view your profile'}</h3>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="profile-container">
//       <div className="profile-header">
//         <div className="profile-cover">
//           <div className="profile-avatar-wrapper">
//             {/* <avatar 
//               src={profileData.avatar || `https://ui-avatars.com/api/?name=${profileData.fullName}&background=2563eb&color=fff&size=128`} 
//               alt={profileData.fullName}
//               className="profile-avatar"
//             /> */}
// <img
//   src={
//     profileData?.avatar
//       ? `http://localhost:5000${profileData.avatar}`
//       : `https://ui-avatars.com/api/?name=${profileData?.fullName}&background=2563eb&color=fff&size=128`
//   }
//   alt="profile"
//   className="profile-avatar"
// />
            
//             <label htmlFor="avatar-upload" className="avatar-upload">
//               <span>{uploadingAvatar ? '⏳' : '📷'}</span>
//               <input
//                 type="file"
//                 id="avatar-upload"
//                 accept="image/*"
//                 onChange={handleAvatarChange}
//                 disabled={uploadingAvatar}
//                 style={{ display: 'none' }}
//               />
//             </label>
//             {uploadingAvatar && <div className="avatar-loading"><Loader size="small" /></div>}
//           </div>
//           <h1>{profileData.fullName}</h1>
//           <p className="profile-email">{profileData.email}</p>
//           {profileData.location && (
//             <p className="profile-location">
//               <span className="location-icon">📍</span>
//               {profileData.location}
//             </p>
//           )}
//         </div>

//         <div className="profile-stats">
//           {getStats().map((stat, index) => (
//             <div key={index} className="stat-card">
//               <span className="stat-icon">{stat.icon}</span>
//               <div className="stat-info">
//                 <span className="stat-value">{stat.value}</span>
//                 <span className="stat-label">{stat.label}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="profile-tabs">
//           <button
//             className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
//             onClick={() => setActiveTab('profile')}
//           >
//             👤 {t('profile') || 'Profile'}
//           </button>
//           <button
//             className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
//             onClick={() => setActiveTab('security')}
//           >
//             🔒 {t('security') || 'Security'}
//           </button>
//           <button
//             className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
//             onClick={() => setActiveTab('preferences')}
//           >
//             ⚙️ {t('preferences') || 'Preferences'}
//           </button>
//         </div>
//       </div>

//       {message.text && (
//         <div className={`message ${message.type}`}>
//           <span className="message-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
//           <span className="message-text">{message.text}</span>
//           <button className="message-close" onClick={() => setMessage({ type: '', text: '' })}>✕</button>
//         </div>
//       )}

//       <div className="profile-content">
//         {activeTab === 'profile' && (
//           <form onSubmit={handleProfileSubmit} className="profile-form">
//             <h2>{t('personalInfo') || 'Personal Information'}</h2>
            
//             <div className="form-group">
//               <label htmlFor="fullName">{t('fullName') || 'Full Name'}</label>
//               <input
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 value={profileData.fullName}
//                 onChange={handleProfileChange}
//                 className={errors.fullName ? 'error' : ''}
//               />
//               {errors.fullName && <span className="error-message">{errors.fullName}</span>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="email">{t('email') || 'Email Address'}</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={profileData.email}
//                 onChange={handleProfileChange}
//                 className={errors.email ? 'error' : ''}
//               />
//               {errors.email && <span className="error-message">{errors.email}</span>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="phone">{t('phone') || 'Phone Number'}</label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={profileData.phone}
//                 onChange={handleProfileChange}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="profession">{t('profession') || 'Profession'}</label>
//               <select
//                 id="profession"
//                 name="profession"
//                 value={profileData.profession}
//                 onChange={handleProfileChange}
//               >
//                 <option value="">{t('selectProfession') || 'Select profession'}</option>
//                 <option value="student">{t('student') || 'Student'}</option>
//                 <option value="lawyer">{t('lawyer') || 'Lawyer'}</option>
//                 <option value="judge">{t('judge') || 'Judge'}</option>
//                 <option value="legal researcher">{t('legalResearcher') || 'Legal Researcher'}</option>
//                 <option value="business owner">{t('businessOwner') || 'Business Owner'}</option>
//                 <option value="other">{t('other') || 'Other'}</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="location">Location</label>
//               <input
//                 type="text"
//                 id="location"
//                 name="location"
//                 value={profileData.location}
//                 onChange={handleProfileChange}
//                 placeholder="City, Country"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="website">Website</label>
//               <input
//                 type="url"
//                 id="website"
//                 name="website"
//                 value={profileData.website}
//                 onChange={handleProfileChange}
//                 placeholder="https://example.com"
//                 className={errors.website ? 'error' : ''}
//               />
//               {errors.website && <span className="error-message">{errors.website}</span>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="bio">{t('bio') || 'Bio'}</label>
//               <textarea
//                 id="bio"
//                 name="bio"
//                 rows="4"
//                 value={profileData.bio}
//                 onChange={handleProfileChange}
//                 placeholder={t('bioPlaceholder') || 'Tell us a little about yourself...'}
//               ></textarea>
//             </div>

//             <button type="submit" className="save-btn" disabled={isLoading}>
//               {isLoading ? <Loader size="small" /> : (t('saveChanges') || 'Save Changes')}
//             </button>
//           </form>
//         )}

//         {activeTab === 'security' && (
//           <form onSubmit={handlePasswordSubmit} className="security-form">
//             <h2>{t('changePassword') || 'Change Password'}</h2>
            
//             <div className="form-group">
//               <label htmlFor="currentPassword">{t('currentPassword') || 'Current Password'}</label>
//               <input
//                 type="password"
//                 id="currentPassword"
//                 name="currentPassword"
//                 value={securityData.currentPassword}
//                 onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
//                 className={errors.currentPassword ? 'error' : ''}
//               />
//               {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="newPassword">{t('newPassword') || 'New Password'}</label>
//               <input
//                 type="password"
//                 id="newPassword"
//                 name="newPassword"
//                 value={securityData.newPassword}
//                 onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
//                 className={errors.newPassword ? 'error' : ''}
//               />
//               {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="confirmPassword">{t('confirmPassword') || 'Confirm New Password'}</label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={securityData.confirmPassword}
//                 onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
//                 className={errors.confirmPassword ? 'error' : ''}
//               />
//               {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
//             </div>

//             <div className="password-requirements">
//               <h4>{t('passwordRequirements') || 'Password Requirements:'}</h4>
//               <ul>
//                 <li className={securityData.newPassword.length >= 8 ? 'met' : ''}>
//                   {t('minLength') || 'At least 8 characters long'}
//                 </li>
//                 <li className={/[A-Z]/.test(securityData.newPassword) ? 'met' : ''}>
//                   {t('uppercaseRequired') || 'At least one uppercase letter'}
//                 </li>
//                 <li className={/[a-z]/.test(securityData.newPassword) ? 'met' : ''}>
//                   At least one lowercase letter
//                 </li>
//                 <li className={/[0-9]/.test(securityData.newPassword) ? 'met' : ''}>
//                   {t('numberRequired') || 'At least one number'}
//                 </li>
//                 <li className={/[^A-Za-z0-9]/.test(securityData.newPassword) ? 'met' : ''}>
//                   At least one special character
//                 </li>
//               </ul>
//             </div>

//             <button type="submit" className="save-btn" disabled={isLoading}>
//               {isLoading ? <Loader size="small" /> : (t('updatePassword') || 'Update Password')}
//             </button>
//           </form>
//         )}

//         {activeTab === 'preferences' && (
//           <div className="preferences-form">
//             <h2>{t('preferences') || 'Preferences'}</h2>
            
//             <div className="preferences-section">
//               <h3>{t('displaySettings') || 'Display Settings'}</h3>
              
//               <div className="preference-item">
//                 <label>{t('language') || 'Language'}</label>
//                 <select
//                   value={preferences.language}
//                   onChange={(e) => handlePreferenceChange('language', e.target.value)}
//                 >
//                   <option value="en">English</option>
//                   <option value="am">አማርኛ</option>
//                   <option value="om">Afaan Oromoo</option>
//                 </select>
//               </div>

//               <div className="preference-item">
//                 <label>{t('fontSize') || 'Font Size'}</label>
//                 <div className="font-size-options">
//                   <button
//                     type="button"
//                     className={`size-option ${preferences.fontSize === 'small' ? 'active' : ''}`}
//                     onClick={() => handlePreferenceChange('fontSize', 'small')}
//                   >
//                     {t('small') || 'Small'}
//                   </button>
//                   <button
//                     type="button"
//                     className={`size-option ${preferences.fontSize === 'medium' ? 'active' : ''}`}
//                     onClick={() => handlePreferenceChange('fontSize', 'medium')}
//                   >
//                     {t('medium') || 'Medium'}
//                   </button>
//                   <button
//                     type="button"
//                     className={`size-option ${preferences.fontSize === 'large' ? 'active' : ''}`}
//                     onClick={() => handlePreferenceChange('fontSize', 'large')}
//                   >
//                     {t('large') || 'Large'}
//                   </button>
//                 </div>
//               </div>

//               <div className="preference-item toggle">
//                 <label>{t('darkMode') || 'Dark Mode'}</label>
//                 <label className="switch">
//                   <input
//                     type="checkbox"
//                     checked={preferences.darkMode}
//                     onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
//                   />
//                   <span className="slider round"></span>
//                 </label>
//               </div>
//             </div>

//             <div className="preferences-section">
//               <h3>{t('notifications') || 'Notifications'}</h3>
              
//               <div className="preference-item toggle">
//                 <label>{t('emailNotifications') || 'Email Notifications'}</label>
//                 <label className="switch">
//                   <input
//                     type="checkbox"
//                     checked={preferences.emailNotifications}
//                     onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
//                   />
//                   <span className="slider round"></span>
//                 </label>
//               </div>
//             </div>

//             <button onClick={handlePreferencesSubmit} className="save-btn" disabled={isLoading}>
//               {isLoading ? <Loader size="small" /> : (t('savePreferences') || 'Save Preferences')}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default UserProfile


//kan dabale
import { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { useLanguage } from '../../../hooks/useLanguage'
import Loader from '../../common/Loader/Loader'
//import api from '../../../services/api'
import './UserProfile.css'

const UserProfile = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const { t } = useLanguage()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profession: user?.profession || '',
    bio: user?.bio || ''
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [preferences, setPreferences] = useState({
    language: user?.preferences?.language || 'en',
    emailNotifications: user?.preferences?.emailNotifications || true,
    darkMode: user?.preferences?.darkMode || false,
    fontSize: user?.preferences?.fontSize || 'medium'
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateProfile = () => {
    const newErrors = {}
    if (!profileData.fullName) {
      newErrors.fullName = 'Full name is required'
    }
    if (!profileData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid'
    }
    return newErrors
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateProfile()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await updateProfile(profileData)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' })
    } finally {
      setIsLoading(false)
    }
  }

  const validatePassword = () => {
    const newErrors = {}
    if (!securityData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    if (!securityData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (securityData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    return newErrors
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validatePassword()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await changePassword(securityData)
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Password change error:', error)
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferenceChange = (name, value) => {
    setPreferences(prev => ({ ...prev, [name]: value }))
  }

  const handlePreferencesSubmit = async () => {
    setIsLoading(true)
    try {
      await updateProfile({ preferences })
      setMessage({ type: 'success', text: 'Preferences updated successfully!' })
    } catch (error) {
      console.error('Preferences update error:', error)
      setMessage({ type: 'error', text: 'Failed to update preferences' })
    } finally {
      setIsLoading(false)
    }
  }

  const getStats = () => {
    return [
      { label: t('bookmarks') || 'Bookmarks', value: user?.stats?.bookmarks || 0, icon: '🔖' },
      { label: t('searches') || 'Searches', value: user?.stats?.searches || 0, icon: '🔍' },
      { label: t('chatSessions') || 'Chat Sessions', value: user?.stats?.chatSessions || 0, icon: '💬' },
      { label: t('memberSince') || 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', icon: '📅' }
    ]
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <div className="error-icon">⚠️</div>
          <h3>{t('loginToViewProfile') || 'Please log in to view your profile'}</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover">
          <h1>{profileData.fullName}</h1>
          <p className="profile-email">{profileData.email}</p>
        </div>

        <div className="profile-stats">
          {getStats().map((stat, index) => (
            <div key={index} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 {t('profile') || 'Profile'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 {t('security') || 'Security'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            ⚙️ {t('preferences') || 'Preferences'}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="message-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span className="message-text">{message.text}</span>
          <button className="message-close" onClick={() => setMessage({ type: '', text: '' })}>✕</button>
        </div>
      )}

      <div className="profile-content">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <h2>{t('personalInfo') || 'Personal Information'}</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">{t('fullName') || 'Full Name'}</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('email') || 'Email Address'}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('phone') || 'Phone Number'}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profession">{t('profession') || 'Profession'}</label>
              <select
                id="profession"
                name="profession"
                value={profileData.profession}
                onChange={handleProfileChange}
              >
                <option value="">{t('selectProfession') || 'Select profession'}</option>
                <option value="student">{t('student') || 'Student'}</option>
                <option value="lawyer">{t('lawyer') || 'Lawyer'}</option>
                <option value="judge">{t('judge') || 'Judge'}</option>
                <option value="legal researcher">{t('legalResearcher') || 'Legal Researcher'}</option>
                <option value="business owner">{t('businessOwner') || 'Business Owner'}</option>
                <option value="other">{t('other') || 'Other'}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bio">{t('bio') || 'Bio'}</label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder={t('bioPlaceholder') || 'Tell us a little about yourself...'}
              ></textarea>
            </div>

            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? <Loader size="small" /> : (t('saveChanges') || 'Save Changes')}
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="security-form">
            <h2>{t('changePassword') || 'Change Password'}</h2>
            
            <div className="form-group">
              <label htmlFor="currentPassword">{t('currentPassword') || 'Current Password'}</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className={errors.currentPassword ? 'error' : ''}
              />
              {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">{t('newPassword') || 'New Password'}</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                className={errors.newPassword ? 'error' : ''}
              />
              {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">{t('confirmPassword') || 'Confirm New Password'}</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="password-requirements">
              <h4>{t('passwordRequirements') || 'Password Requirements:'}</h4>
              <ul>
                <li className={securityData.newPassword.length >= 8 ? 'met' : ''}>
                  {t('minLength') || 'At least 8 characters long'}
                </li>
                <li className={/[A-Z]/.test(securityData.newPassword) ? 'met' : ''}>
                  {t('uppercaseRequired') || 'At least one uppercase letter'}
                </li>
                <li className={/[a-z]/.test(securityData.newPassword) ? 'met' : ''}>
                  At least one lowercase letter
                </li>
                <li className={/[0-9]/.test(securityData.newPassword) ? 'met' : ''}>
                  {t('numberRequired') || 'At least one number'}
                </li>
                <li className={/[^A-Za-z0-9]/.test(securityData.newPassword) ? 'met' : ''}>
                  At least one special character
                </li>
              </ul>
            </div>

            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? <Loader size="small" /> : (t('updatePassword') || 'Update Password')}
            </button>
          </form>
        )}

        {activeTab === 'preferences' && (
          <div className="preferences-form">
            <h2>{t('preferences') || 'Preferences'}</h2>
            
            <div className="preferences-section">
              <h3>{t('displaySettings') || 'Display Settings'}</h3>
              
              <div className="preference-item">
                <label>{t('language') || 'Language'}</label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="am">አማርኛ</option>
                  <option value="om">Afaan Oromoo</option>
                </select>
              </div>

              <div className="preference-item">
                <label>{t('fontSize') || 'Font Size'}</label>
                <div className="font-size-options">
                  <button
                    type="button"
                    className={`size-option ${preferences.fontSize === 'small' ? 'active' : ''}`}
                    onClick={() => handlePreferenceChange('fontSize', 'small')}
                  >
                    {t('small') || 'Small'}
                  </button>
                  <button
                    type="button"
                    className={`size-option ${preferences.fontSize === 'medium' ? 'active' : ''}`}
                    onClick={() => handlePreferenceChange('fontSize', 'medium')}
                  >
                    {t('medium') || 'Medium'}
                  </button>
                  <button
                    type="button"
                    className={`size-option ${preferences.fontSize === 'large' ? 'active' : ''}`}
                    onClick={() => handlePreferenceChange('fontSize', 'large')}
                  >
                    {t('large') || 'Large'}
                  </button>
                </div>
              </div>

              <div className="preference-item toggle">
                <label>{t('darkMode') || 'Dark Mode'}</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={preferences.darkMode}
                    onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="preferences-section">
              <h3>{t('notifications') || 'Notifications'}</h3>
              
              <div className="preference-item toggle">
                <label>{t('emailNotifications') || 'Email Notifications'}</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <button onClick={handlePreferencesSubmit} className="save-btn" disabled={isLoading}>
              {isLoading ? <Loader size="small" /> : (t('savePreferences') || 'Save Preferences')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile