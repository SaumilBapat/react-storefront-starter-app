import React from 'react'
import { Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useLazyState from 'react-storefront/hooks/useLazyState'
import CmsSlot from 'react-storefront/CmsSlot'
import LoadMask from 'react-storefront/LoadMask'
import Head from 'next/head'
import createLazyProps from 'react-storefront/props/createLazyProps'
import fetchFromAPI from 'react-storefront/props/fetchFromAPI'
import SMSForm from './SMSForm';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    margin: theme.spacing(10, 0, 0, 0),
  },
}))

export default function Index(lazyProps) {
  const classes = useStyles()
  const [state] = useLazyState(lazyProps)
  console.log('Headings: ' + state.pageData.slots.heading);
// Title: {state.pageData.title}
// Description: {state.pageData.slots.heading}

  return (
    <>
      {state.loading ? null : (
        <Head>
          <title>Owlibaba</title>
        </Head>
      )}
      <Container maxWidth="lg">
        {state.loading ? (
          <LoadMask fullscreen />
        ) : (
          <div className={classes.main}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
            Welcome to Owlibaba!
            </Typography>
            <CmsSlot>Browse around to see our new product offerings!</CmsSlot>
          </div>
        )}
      </Container>
      <SMSForm />
    </>
  )
}

Index.getInitialProps = createLazyProps(options => {
  const { res } = options
  if (res) res.setHeader('Cache-Control', 'max-age=99999')
  return fetchFromAPI(options)
})
