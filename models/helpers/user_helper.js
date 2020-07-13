const params = require('params');
class UserHelper {
    userDocument(data) {
        return {  
          index: 'users',
          type: 'personal',
          body: userBodyHash(data)
        }
    }

    async filterQuery(data){
        var builder = {};
        builder["size"] =  data.page_size ? data.page_size : 10;
        builder["from"] = ((data.page_size && data.page_number) ? data.page_size*(data.page_number-1) : 10);
        builder["query"] = {}
        builder["query"]["bool"] = {}
        if(data.q)
            builder["query"]["bool"]["filter"] = this.queryFilter(data.q)
        builder["query"]["bool"]["must"] = [{ "match": { "looking_for_job_in_US": true } }]
        if(data.filter.skills)
            builder["query"]["bool"]["must"].push({"wildcard": { "skills": "*"+ data.filter.skills +"*" }})
        if(data.filter.job_city)
            builder["query"]["bool"]["must"].push({ "match": {"job_city": data.filter.job_city }})
        if(data.filter.job_type)
            builder["query"]["bool"]["must"].push({"match": { "looking_for_job_type": data.filter.job_type } })
        if(data.filter.location)
            builder["query"]["bool"]["must"].push({"match": { "city": data.filter.location } })
        if(data.filter.experience_from || data.filter.experience_to){
            var obj = {}
            obj["range"] = {}
            obj["range"]["total_experience"] = {}
            if(data.filter.experience_from)
                obj["range"]["total_experience"]["gte"] = data.filter.experience_from;
            if(data.filter.experience_to)
                obj["range"]["total_experience"]["lte"] = data.filter.experience_to;
            builder["query"]["bool"]["must"].push(obj)
        }
        if(data.filter.salary_from || data.filter.salary_to){
            var obj1 = {}
            obj1["range"] = {}
            obj1["range"]["salary_from"] = {}
            if(data.filter.salary_from)
                obj1["range"]["salary_from"]["gte"] = data.filter.salary_from;
            if(data.filter.salary_to)
                obj1["range"]["salary_from"]["lte"] = data.filter.salary_to;
            builder["query"]["bool"]["must"].push(obj1)
        }
        return builder;
    }

    queryFilter(data){
        return { "bool": { "should": [{ "wildcard": { "last_or_current_pos": "*" + data + "*" }}, { "wildcard": { "looking_for_job_title": "*" + data + "*" }}]}}
    }

    async userBodyHash(data, original = {}){
        let permittedParams = await params(data).only(this.permittedParamsFun());
        let body = await {
            "email": permittedParams.email,
            "first_name": permittedParams.first_name,
            "middle_name": permittedParams.middle_name,
            "last_name": permittedParams.last_name,
            "dob": permittedParams.dob,
            "nationality": permittedParams.nationality,
            "picture": permittedParams.picture,
            "location": permittedParams.location,
            "city": this.valueOf(permittedParams, "city", original),
            "last_or_current_employer": permittedParams.last_or_current_employer,
            "last_or_current_pos": permittedParams.last_or_current_pos,
            "level_of_education": permittedParams.level_of_education,
            "school_name": permittedParams.school_name,
            "graducation": permittedParams.graducation,
            "still_in_school": permittedParams.still_in_school,
            "special_field": permittedParams.special_field,
            "start_year": permittedParams.start_year,
            "phone": permittedParams.phone,
            "end_year": permittedParams.end_year, // yaha tk require fields
            "looking_for_job_in_US": this.valueOf(permittedParams, "looking_for_job_in_US", original),
            "skills": this.valueOf(permittedParams, "skills", original),
            "experience": this.valueOf(permittedParams, "experience", original),
            "education": this.valueOf(permittedParams, "education", original),
            "languages": this.valueOf(permittedParams, "languages", original),
            "looking_for_job_title": this.valueOf(permittedParams, "looking_for_job_title", original),
            "looking_for_job_type": this.valueOf(permittedParams, "looking_for_job_type", original),
            "salary_from": this.valueOf(permittedParams, "salary_from", original),
            "salary_to": this.valueOf(permittedParams, "salary_to", original),
            "looking_for_company": this.valueOf(permittedParams, "looking_for_company", original),
            "experience_level": this.valueOf(permittedParams, "experience", original),
            "notice_period": this.valueOf(permittedParams, "notice_period", original),
            "position": this.valueOf(permittedParams, "position", original),
            "okay_to_locate": this.valueOf(permittedParams, "okay_to_locate", original),
            "job_city": this.valueOf(permittedParams, "job_city", original),
            "eurpoe": this.valueOf(permittedParams, "eurpoe", original),
            "asia": this.valueOf(permittedParams, "asia", original),
            "australia": this.valueOf(permittedParams, "australia", original),
            "north_ameria": this.valueOf(permittedParams, "north_ameria", original),
            "south_ameria": this.valueOf(permittedParams, "south_ameria", original),
            "world_wide": this.valueOf(permittedParams, "world_wide", original)
        };
        return body;
    }

    valueOf(params, key, original){
        let val = "";
        if(["experience", "education", "languages"].includes(key))
            val = [];
       return (typeof params[key] == "undefined" ? typeof original[key] == "undefined" ? val : original[key] : params[key])
    }

    permittedParamsFun(){
        return ["email","first_name","middle_name","last_name","dob",
        "nationality","picture","location","city","last_or_current_employer",
        "last_or_current_pos","level_of_education","school_name",
        "graducation","still_in_school","special_field","start_year",
        "end_year","looking_for_job_in_US","skills","experience","education",
        "phone","languages","looking_for_job_title","looking_for_job_type",
        "salary_from","salary_to","looking_for_company","experience_level","notice_period",
        "position","okay_to_locate","job_city","eurpoe","asia","australia","north_ameria",
        "south_ameria","world_wide"]
    }
}

module.exports = new UserHelper();