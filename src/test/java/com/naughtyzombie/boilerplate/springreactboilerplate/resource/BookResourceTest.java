package com.naughtyzombie.boilerplate.springreactboilerplate.resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naughtyzombie.boilerplate.springreactboilerplate.model.Book;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@SqlGroup({
        @Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:insert.sql"),
        @Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:clean.sql")
})
public class BookResourceTest {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private WebApplicationContext wac;
    private MockMvc mockMvc;

    @Before
    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void loadAllBooksRestTest() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/allbooks")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        String expected = "[{'id':1,'name':'Spring Boot React Example','price':0.0}]";

        JSONAssert.assertEquals(expected,result.getResponse().getContentAsString(), false);
    }

    @Test
    public void addNewBooksRestTest() throws Exception {

        Book book = new Book();
        book.setId(2L);
        book.setName("New Test Book");
        book.setPrice(1.75);

        String json = mapper.writeValueAsString(book);

        MvcResult result = mockMvc.perform(post("/api/addbook")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
                    .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        String expected = "[{'id':1,'name':'Spring Boot React Example','price':0.0}," +
                "{'id':2,'name':'New Test Book','price':1.75}]";

        JSONAssert.assertEquals(expected,result.getResponse().getContentAsString(), false);
    }

}