import {Component, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {IoSearchOutline, IoLocationSharp} from 'react-icons/io5'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
// import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const compStatus = {
  inProgress: 'LOADING',
  failed: 'FAILED',
  success: 'SUCCESS',
}

const Filters = props => {
  const {changeSalary, changeEmployment, salary, employment} = props

  return (
    <div className="filters">
      <hr />
      <h1>Type of Employment</h1>
      <ul>
        {employmentTypesList.map(item => (
          <Checkbox
            itemDetails={item}
            key={item.employmentTypeId}
            callFunc={() => changeEmployment(item.employmentTypeId)}
            checked={employment.includes(item.employmentTypeId)}
          />
        ))}
      </ul>
      <hr />
      <h1>Salary Range</h1>
      <ul>
        {salaryRangesList.map(item => (
          <Radio
            itemDetails={item}
            key={item.salaryRangeId}
            checked={salary === item.salaryRangeId}
            updateSalaryRange={() => changeSalary(item.salaryRangeId)}
          />
        ))}
      </ul>
    </div>
  )
}

const InputEl = props => {
  const {changeSch, dataFun, sch} = props
  const search = () => dataFun()
  const keySearch = event => {
    if (event.key === 'Enter') {
      search()
    }
  }
  return (
    <div className="search-box span-2 start-2">
      <input
        type="search"
        placeholder="Search"
        className="search-inp"
        value={sch}
        onChange={event => changeSch(event.target.value)}
        onKeyDown={keySearch}
        onInput={event => changeSch(event.target.value)}
      />
      <button
        type="button"
        className="search-btn"
        onClick={search}
        aria-label="search"
        data-testid="searchButton"
      >
        <IoSearchOutline />
      </button>
    </div>
  )
}

const Loading = () => (
  <div className="loader-container" data-testid="loader">
    <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
  </div>
)

const ProfileCard = () => {
  const [profile, setProfile] = useState('')
  const [compState, setCompState] = useState(compStatus.inProgress)
  const getProfile = async () => {
    setCompState(compStatus.inProgress)
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    if (response.ok) {
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      setProfile(formattedData)
      setCompState(compStatus.success)
    } else {
      setCompState(compStatus.failed)
    }
  }
  useEffect(() => getProfile(), [])
  const Pcard = () =>
    compState === compStatus.failed ? (
      <div className="retry">
        <button className="retry-btn" type="button" onClick={getProfile}>
          Retry
        </button>
      </div>
    ) : (
      <div className="profile-box">
        <img src={profile.profileImageUrl} alt="profile" />
        <p>{profile.name}</p>
        <p>{profile.shortBio}</p>
      </div>
    )

  return compState === compStatus.inProgress ? <Loading /> : <Pcard />
}

const Checkbox = props => {
  const {itemDetails, callFunc, checked} = props
  const {employmentTypeId, label} = itemDetails
  return (
    <li>
      <input
        type="checkbox"
        id={employmentTypeId}
        value={employmentTypeId}
        checked={checked}
        onChange={callFunc}
      />
      <label htmlFor={employmentTypeId}>{label}</label>
    </li>
  )
}

const Radio = props => {
  const {itemDetails, updateSalaryRange, checked} = props
  const {salaryRangeId, label} = itemDetails
  return (
    <li>
      <input
        name="Salary Range"
        type="radio"
        id={salaryRangeId}
        value={salaryRangeId}
        checked={checked}
        onChange={updateSalaryRange}
      />
      <label htmlFor={salaryRangeId}>{label}</label>
    </li>
  )
}

const JobCard = props => {
  const {itemDetails} = props
  const [
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  ] = [
    itemDetails.company_logo_url,
    itemDetails.employment_type,
    itemDetails.id,
    itemDetails.job_description,
    itemDetails.location,
    itemDetails.package_per_annum,
    itemDetails.rating,
    itemDetails.title,
  ]
  return (
    <li className="job-card">
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="card-header">
          <img src={companyLogoUrl} alt="company logo" />
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
          <p className="ppa">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </Link>
    </li>
  )
}

const Failed = props => {
  const {getData} = props
  return (
    <div className="span-2 failed">
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

class Jobs extends Component {
  state = {
    salary: '',
    employment: [],
    sch: '',
    compState: compStatus.inProgress,
    jobsList: [],
  }

  componentDidMount() {
    console.log('in mount')
    this.getData()
  }

  getData = async () => {
    const {compState} = this.state
    if (compState !== compStatus.inProgress) {
      this.setState({compState: compStatus.inProgress})
    }
    const {sch, salary, employment} = this.state
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const myUrl = `https://apis.ccbp.in/jobs?employment_type=${employment.join(
      ',',
    )}&minimum_package=${salary}&search=${sch}`
    const response = await fetch(myUrl, options)
    const fetchedData = await response.json()
    if (response.ok) {
      this.setState({jobsList: fetchedData.jobs, compState: compStatus.success})
    } else {
      this.setState({compState: compStatus.failed})
    }
  }

  changeSalary = val => {
    this.setState({salary: val, compState: compStatus.inProgress}, this.getData)
  }

  changeEmployment = val => {
    this.setState(prevState => {
      if (prevState.employment.includes(val)) {
        return {
          employment: [...prevState.employment].toSpliced(
            prevState.employment.indexOf(val),
            1,
          ),
          compState: compStatus.inProgress,
        }
      }
      return {
        employment: [...prevState.employment, val],
        compState: compStatus.inProgress,
      }
    }, this.getData)
  }

  changeSch = val => this.setState({sch: val})

  renderJobCards = () => {
    const {jobsList} = this.state
    return (
      <ul className="jobs-con span-2">
        {jobsList.length > 0 ? (
          jobsList.map(item => <JobCard itemDetails={item} key={item.id} />)
        ) : (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        )}
      </ul>
    )
  }

  renderSuccessFailed = () => {
    const {compState} = this.state
    return compState === compStatus.failed ? (
      <Failed getData={this.getData} />
    ) : (
      this.renderJobCards()
    )
  }

  render() {
    console.log(this.state)
    const {salary, employment, compState, sch} = this.state
    return (
      <div className="wrapper">
        <div className="jobs-content">
          <InputEl
            changeSch={this.changeSch}
            dataFun={this.getData}
            val={sch}
          />
          <div className="md-order-1">
            <ProfileCard />
            <Filters
              changeEmployment={this.changeEmployment}
              changeSalary={this.changeSalary}
              salary={salary}
              employment={employment}
            />
          </div>
          {compState === compStatus.inProgress ? (
            <Loading />
          ) : (
            this.renderSuccessFailed()
          )}
        </div>
      </div>
    )
  }
}

export default Jobs
