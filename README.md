# Wellcome Policy Tool

This repository will include all code needed to bring up Wellcome's
Policy Tool, a service that reports which research publications are
cited in the policy documents produced by policy organizations such as
the WHO, MSF, and the UK government.

## wsf-web-scraper/

See [wsf-web-scraper/README.md](wsf-web-scraper/README.md).

## Wellcome Reference Parser

The top-level files in this repo currently hold Policy Tool's reference
parser, which uses a home trained model to identify components from a
set of scraped reference sections and to find those directly related to
Wellcome.

## Requirements
This project use Pipenv to manage its dependencies.
It also requires a PostgreSQL server to store the results on production.

### Development
To develop for this project, you will need:
1. Python 3.5 or higher and `virtualenv`
2. PostgreSQL 9 or higher
3. A clean json file containing reference sections
4. A clean csv file containing all your references

Once you have everything installed, run:
  * `make virtualenv`
  * `source build/virtualenv/bin/activate`

## How to use it
### Method 1.
Use the manage.py command cli:

```
python manage.py [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  recreate_db  # Creates a parser_references database on your PostgreSQL server
  run_predict  # Runs the actual prediction
```
Running `run_predict` needs two arguments:
```
python manage.py run_predict [OPTIONS] SCRAPER_FILE REFERENCES_FILE
```
 Where SCRAPER_FILE is a Json file obtained through the web scraper and REFERENCES_FILE a CSV file containing the references.


### Method 2.
This repository includes a `settings.py` file, where you can manually configure your options.

Once you're happy with your configuration, just run `python main.py`

### Method 3.

Make an output folder `output_folder_name`, set the ORGANISATION environmental variable to the one you are parsing, and run `refparse.py` with arguments of your file locations, e.g. for msf in the terminal run:

```
mkdir -p /tmp/parser-output/output_folder_name

export ORGANISATION=msf

python ./refparse.py \
    --scraper-file "s3://datalabs-data/scraper-results/msf/20190117.json" \
    --references-file "match-references/MRC_Publications_Nov2018_JGHT_JHSRI.csv" \
    --model-file "s3://datalabs-data/reference_parser_models/RefSorter_classifier.pkl" \
    --vectorizer-file "s3://datalabs-data/reference_parser_models/RefSorter_vectorizer.pkl" \
    --output-url "file:///tmp/parser-output/output_folder_name" \
    --num-workers None
```

If the `scraper_file`, `references_file`, `model_file`, and `vectorizer_file` arguments are to S3 locations then make sure these start with `s3://`, otherwise file names are assumed to be locally stored. If the `output_url` argument is to a local location, then make sure it begins with `file://`, otherwise it is assumed to be from a database.

### Method 4.

If you would like to run the parser for the latest scraped files and to save the output locally, then first save an environmental variable with your organisation name in and then run the parser, e.g. for msf:
```
export ORGANISATION=msf
python parse_latest.py msf
```
Where the organisation is one of gov_uk, msf, nice, parliament, unicef, or who_iris.

If you want to specify the arguments for the other inputs then you can, otherwise default values will be given:

```
export ORGANISATION=msf

python ./parse_latest.py msf \
    --references-file "match-references/MRC_Publications_Nov2018_JGHT_JHSRI.csv" \
    --model-file "s3://datalabs-data/reference_parser_models/RefSorter_classifier.pkl" \
    --vectorizer-file "s3://datalabs-data/reference_parser_models/RefSorter_vectorizer.pkl" \
    --output-url "file:///tmp/parser-output/output_folder_name" \
    --num-workers None
```

Warning that this could take some time.


## Contributing
See the [Contributing guidelines](./CONTRIBUTING.md)
