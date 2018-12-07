'use strict';

const pkg = require( '../package' );
const Config = require( '../utils/config' )( pkg.name ).current;
const path = require( 'path' );
const url = require( 'url' );
const jwt = require( 'jsonwebtoken' );

// TODO: figure out where the HTML files will go
const index_html_dir = path.resolve( __dirname, '..', Config().build ? 'build' : '', 'views', 'src' );

// TODO: Figure out views and build navigation routes from those

const routes = [
  '/terms-of-service',
  '/error',
  '/unauthorized',
  '/login',
  '/welcome',
  '/:view(|home)',
  '/:view(home)/:entity(dashboard|widget)/:page(editor)',
  '/:group/:view/:section?',
  '/:group(quality-assurance)/:view(call-inspector)/:section(browse)/:detail(|detail)',
  '/:group(quality-assurance)/:view(flagged-calls)/:section(|short|single-speaker|outbound-voicemail)/:detail(|detail)',
  '/:group(call-analytics)/:view(reporting)/:section(custom-reports)/:page(|create|view)',
  '/:group(administration)/:view(users)/:section(agent-management)/:page(|edit|add)',
  '/:group(quality-assurance)/:view(keyword-tracking)/:page(|detail)',
  '/:group(quality-assurance)/:view(workflows)/:section(workflow-list|call-review)/:page(pending|reviewed|detail)?',
  '/:group(quality-assurance)/:view(playbooks)/:section(manage)/:detail(lines)?',
  '/:group(administration)/:view(integrations)/:section(talkdesk)'
];

module.exports = function () {

  const router = require( 'express' ).Router();

  routes.forEach( route => router.route( route ).get( index ) );

  function index( req, res ) {
    return res.sendFile( 'index.html', { root: index_html_dir } );
  }

  return router;

};
