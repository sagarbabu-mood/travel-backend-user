import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {v4} from 'uuid'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
// import Header from '../Header'
import './index.css'

const compStatus = {
  inProgress: 'LOADING',
  failed: 'FAILED',
  success: 'SUCCESS',
}

const Loading = () => (
  <div className="loader-container" data-testid="loader">
    <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
  </div>
)

const Failed = props => {
  const {getData} = props
  return (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry-btn" onClick={getData}>
        Retry
      </button>
    </div>
  )
}

const SimilarJob = props => {
  const {itemDetails} = props
  const {title, rating, id, location} = itemDetails
  const [companyLogoUrl, jobDescription, employmentType] = [
    itemDetails.company_logo_url,
    itemDetails.job_description,
    itemDetails.employment_type,
  ]
  return (
    <li className="similar-job-card">
      <Link to={`/jobs/${id}`} className="job-link sim-job-link">
        <div className="card-header">
          <img src={companyLogoUrl} alt="similar job company logo" />
          <div>
            <h1>{title}</h1>
            <div className="ratings">
              <FaStar />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <h1>Description</h1>
        <p>{jobDescription}</p>
        <div className="card-liner sim-card-liner">
          <IoLocationSharp />
          <p>{location}</p>
          <BsBriefcaseFill />
          <p>{employmentType}</p>
        </div>
      </Link>
    </li>
  )
}

const RenderDetails = props => {
  const {jobDetails} = props
  const {
    skills,
    title,
    location,
    rating,
  } = jobDetails
  const [
    companyLogoUrl,
    companyWebsiteUrl,
    employmentType,
    jobDescription,
    lifeAtCompany,
    packagePerAnnum,
  ] = [
    jobDetails.company_logo_url,
    jobDetails.company_website_url,
    jobDetails.employment_type,
    jobDetails.job_description,
    jobDetails.life_at_company,
    jobDetails.package_per_annum,
  ]
  return (
    <div className="details-card">
      <div className="card-header">
        <img src={companyLogoUrl} alt="job details company logo" />
        <div>
          <h1>{title}</h1>
          <div className="ratings">
            <FaStar />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <div className="card-liner">
        <IoLocationSharp />
        <p>{location}</p>
        <BsBriefcaseFill />
        <p>{employmentType}</p>
        <p>{packagePerAnnum}</p>
      </div>
      <hr />
      <div className="des">
        <h1>Description</h1>
        <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
          Visit
          <FiExternalLink />
        </a>
      </div>
      <p>{jobDescription}</p>
      <h1>Skills</h1>
      <ul className="skills-con">
        {skills.map(item => (
          <li key={v4()}>
            <img src={item.image_url} alt={item.name} />
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
      <h1>Life at Company</h1>
      <div className="lac">
        <p>{lifeAtCompany.description}</p>
        <img src={lifeAtCompany.image_url} alt="life at company" />
      </div>
    </div>
  )
}

class JobItemDetails extends Component {
  state = {details: {}, compState: compStatus.inProgress}

  componentDidMount() {
    console.log('in did mount')
    this.getData()
  }

  getData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const formattedData = {
        jobDetails: fetchedData.job_details,
        similarJobs: fetchedData.similar_jobs,
      }
      this.setState({details: formattedData, compState: compStatus.success})
    } else {
      this.setState({compState: compStatus.failed})
    }
  }

  renderSuccessFailed = () => {
    const {details, compState} = this.state
    const {jobDetails, similarJobs} = details
    return compState === compStatus.success ? (
      <div className="wrapper">
        <div className="details-content">
          <RenderDetails jobDetails={jobDetails} />
          <h1>Similar jobs</h1>
          <ul className="similar-jobs-con">
            {similarJobs.map(item => (
              <SimilarJob itemDetails={item} key={item.id} />
            ))}
          </ul>
        </div>
      </div>
    ) : (
      <Failed getData={this.getData} />
    )
  }

  render() {
    console.log(this.state)
    const {compState} = this.state

    return compState === compStatus.inProgress ? (
      <Loading />
    ) : (
      this.renderSuccessFailed()
    )
  }
}

export default JobItemDetails
