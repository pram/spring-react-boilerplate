package com.naughtyzombie.boilerplate.springreactboilerplate.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthorizationTokenFilter extends OncePerRequestFilter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private UserDetailsService userDetailsService;
    private JwtTokenUtil jwtTokenUtil;
    private String tokenHeader;

    public JwtAuthorizationTokenFilter(UserDetailsService userDetailsService, JwtTokenUtil jwtTokenUtil, String tokenHeader) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.tokenHeader = tokenHeader;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        logger.debug("Processing authentication for '{}'", request.getRequestURL());

        final String requestHeader = request.getHeader(this.tokenHeader);
        final String accessToken = request.getParameter("access_token");

        String username = null;
        String authToken = null;
        boolean emptyAccessToken = StringUtils.isEmpty(accessToken);

        if (requestHeader != null && requestHeader.startsWith("Bearer ") || !emptyAccessToken) {
            if (emptyAccessToken) {
                authToken = requestHeader.substring(7);
            } else {
                authToken = accessToken;
            }
            try {
                username = jwtTokenUtil.getUsernameFromToken(authToken);
            } catch (IllegalArgumentException e) {
                logger.error("Username could not be retrieved from Token", e);
            } catch (ExpiredJwtException e) {
                logger.warn("Token Expired", e);
            }
        } else {
            logger.warn("Bearer string not found - header ignored");
        }

        logger.debug("checking authentication for user '{}'", username);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.debug("security context null");

            //No need to store user details in database but probably better to just in case user has been revoked
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(authToken, userDetails)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                logger.info("authorized user '{}', setting security context", username);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        chain.doFilter(request, response);
    }


}
