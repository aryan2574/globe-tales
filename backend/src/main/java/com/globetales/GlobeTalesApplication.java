package com.globetales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.CronScheduleBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GlobeTalesApplication {
    public static void main(String[] args) {
        SpringApplication.run(GlobeTalesApplication.class, args);
    }

    @Bean
    public JobDetail chemnitzSitesUpdateJobDetail() {
        return JobBuilder.newJob(com.globetales.service.OverpassService.ChemnitzSitesUpdateJob.class)
                .withIdentity("chemnitzSitesUpdateJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger chemnitzSitesUpdateJobTrigger(JobDetail chemnitzSitesUpdateJobDetail) {
        // Every 3 days at midnight
        return TriggerBuilder.newTrigger()
                .forJob(chemnitzSitesUpdateJobDetail)
                .withIdentity("chemnitzSitesUpdateTrigger")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0 0 1/3 * ?"))
                .build();
    }
} 