var mapping = { 
  email: { type: 'text', index: true },
  phone: { type: 'text', index: true },
  firstname: { type: 'text' },
  middle_name: { type: 'text' },
  last_name: { type: 'text' },
  dob: { type: 'date', "format": "yyyy-MM-dd" },
  nationality: { type: 'text' },
  picture: { type: 'text' },
  city: { type: 'text', index: true },
  last_or_current_employer: { type: 'text' },
  last_or_current_pos: { type: 'text' },
  level_of_education: { type: 'text' },
  still_in_school: { type: 'boolean' },
  school_name: { type: 'text' },
  graducation: { type: 'text' },
  special_field: { type: 'text' },
  start_year: { type: 'text' },
  end_year: { type: 'text' },

  looking_for_job_in_US: { type: 'text' },
  // comma seperated skills
  skills: { type: 'text' },
  experience: {
    properties: {
      start_date:  { type: 'date', "format": "yyyy-MM-dd" },
      end_data:    { type: 'date', "format": "yyyy-MM-dd"},
      title:       { type: "text"},
      company:     { type: "text"},
      description: { type: "text"}
    }
  },
  total_experience: { type: 'float', index: true },
  education: {
    properties: {
      school_name: { type: "text" },
      graducation: { type: "text" },
      special_field: { type: "text" },
      start_year: { type: "text" },
      end_year: { type: "text"}
    }
  },
  languages: {
    properties: {
      fluent_written_oral: { type: "text" },
      fluent_one: { type: "text" },
      level: { type: "text"}
    }
  },
  looking_for_job_title: {type: "text",index: true},
  looking_for_job_type: { type: 'text',index: true },
  salary_from: { type: 'integer', index: true },
  salary_to: { type: 'integer', index: true },
  looking_for_company: { type: 'text',index: true },
  experience_level: { type: 'text' },
  notice_period: { type: 'text' },
  position: { type: 'text' },
  okay_to_locate: { type: 'text' },
  job_city: { type: 'text' },
  eurpoe: { type: 'boolean',"null_value": false },
  asia: { type: 'boolean',"null_value": false },
  australia: { type: 'boolean',"null_value": false },
  north_ameria: { type: 'boolean',"null_value": false },
  south_ameria: { type: 'boolean',"null_value": false },
  world_wide: { type: 'boolean',"null_value": false },
  created_on: { type: 'date',"null_value": new Date() },updated_at: { type: 'date', "null_value": new Date() }
}
module.exports = mapping;